import * as Result from './result';
import * as Types from './types';
import * as HereTypes from './here-types';

export class GeoMapCodingServiceHere
  implements Types.GeoMapCodingServiceImplementation {
  private platform: H.service.Platform;

  public static create(init: {
    api: Types.HereApi;
    platform: H.service.Platform;
  }): GeoMapCodingServiceHere {
    return new GeoMapCodingServiceHere(init);
  }

  private constructor(init: {
    api: Types.HereApi;
    platform: H.service.Platform;
  }) {
    this.platform = init.platform;
  }

  public async geocode(
    search: Types.GeocoderRequest
  ): Promise<Types.GeocoderResult> {
    return new Promise((resolve, reject) => {
      const geoCoder = this.platform.getGeocodingService();

      geoCoder.geocode(
        geocoderRequestToHereServiceParameters(search),
        result => {
          resolve(hereServiceResultToGeocoderResult(result));
        },
        error => reject(error)
      );
    });
  }

  public async reverse(
    location: Types.GeoPoint
  ): Promise<Types.Result<Types.GeoMapPlaceDetails[]>> {
    return new Promise<Types.Result<Types.GeoMapPlaceDetails[]>>(resolve => {
      const service = this.platform.getGeocodingService();

      service.reverseGeocode(
        {
          pos: `${location.lat},${location.lng},0`,
          locationattributes:
            'address,-mapView,additionalData,mapReference,adminIds',
          mode: 'retrieveAddresses',
          prox: `${location.lat},${location.lng},0`,
          jsonattributes: '1',
          responseattributes: 'ps,mq,mt,mc,pr'
        },
        serviceResult => {
          if (!serviceResult.response) {
            resolve(Result.createFailure(new Error(serviceResult.details)));
          }

          // tslint:disable-next-line
          const response = (serviceResult.response as any) as {
            view: { result: HereTypes.Place[] }[];
          };
          const container = response.view[0];

          if (!container) {
            return resolve(Result.createSuccess([]));
          }

          resolve(
            Result.createSuccess(
              container.result
                .map(herePlaceToGeoPlace)
                .filter(place => typeof place.id === 'string')
            )
          );
        },
        serviceError => resolve(Result.createFailure(serviceError))
      );
    });
  }
}

function geocoderRequestToHereServiceParameters(
  search: Types.GeocoderRequest
): H.service.ServiceParameters {
  if (typeof search === 'string') {
    return {
      searchText: search
    };
  }

  return {
    country: search.country
  };
}

function hereServiceResultToGeocoderResult(
  result: H.service.ServiceResult
): Types.GeocoderResult {
  const firstResult = result.Response.View[0].Result[0];

  return {
    position: hereLatLngToGeoPoint(firstResult.Location.DisplayPosition),
    viewBounds: hereLatLngBoundsToGeoBounds(firstResult.Location.MapView)
  };
}

function hereLatLngToGeoPoint(
  latlng: HereTypes.GeocoderLatLng
): Types.GeoPoint {
  return {
    lat: latlng.Latitude,
    lng: latlng.Longitude
  };
}

function hereLatLngBoundsToGeoBounds(
  bounds: HereTypes.GeocoderLatLngBounds
): Types.GeoBounds {
  return {
    east: bounds.BottomRight.Longitude,
    north: bounds.TopLeft.Latitude,
    south: bounds.BottomRight.Latitude,
    west: bounds.TopLeft.Longitude
  };
}

function herePlaceToGeoPlace(
  herePlace: HereTypes.Place
): Types.GeoMapPlaceDetails {
  const address = herePlace.location.address;
  const countryNameEntry =
    Array.isArray(address.additionalData) &&
    address.additionalData.find(d => d.key === 'CountryName');

  return {
    provider: Types.GeoMapProvider.Here,
    id: herePlace.location.locationId,
    formattedAddress: herePlace.location.address.label,
    address: {
      country: countryNameEntry ? countryNameEntry.value : address.country,
      countryCode: address.country,
      county: address.county,
      district: address.district,
      state: address.state,
      postalCode: address.postalCode,
      locality: address.city,
      route: address.street,
      streetNumber: address.houseNumber
    }
  };
}
