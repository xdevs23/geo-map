import * as Result from './result';
import * as Types from './types';

interface HerePlace {
  name: string;
  placeId: string;
  view: string;
  location: {
    position: [number, number];
    address: {
      city?: string;
      country?: string;
      countryCode?: string;
      county?: string;
      district?: string;
      house?: string;
      postalCode?: string;
      state?: string;
      street?: string;
      text: string;
    };
    access: HerePlaceAccess[];
  };
  categories: HerePlaceCategory[];
  icon: string;
  media: {
    images: Images;
    reviews: Ratings;
    ratings: Ratings;
  };
  related: Related;
  report: {
    title: string;
    href: string;
    type: string;
  };
}

interface HerePlaceCategory {
  id: string;
  title: string;
  href: string;
  type: string;
  system?: string;
  icon: string;
}

export interface HerePlaceAccess {
  position: number[];
  accessType: string;
}

export interface Images {
  available: number;
  next: string;
  items: ImagesItem[];
}

export interface ImagesItem {
  src: string;
  id: string;
  href: string;
  type: string;
  date: string;
  supports: string[];
  user: {
    id: string;
    name: string;
  };
  via: {
    href: string;
    type: string;
  };
  supplier: HerePlaceCategory;
  attribution: string;
}

export interface Ratings {
  available: number;
  items: RatingsItem[];
}

export interface RatingsItem {
  count: number;
  average: number;
  via: {
    href: string;
    type: string;
  };
  supplier: HerePlaceCategory;
  attribution: string;
}

export interface Related {
  recommended: {
    title: string;
    href: string;
    type: string;
  };
  'public-transport': {
    title: string;
    href: string;
    type: string;
  };
}

export class GeoMapPlacesServiceHere
  implements Types.GeoMapPlacesServiceImplementation {
  private platform: H.service.Platform;
  private api: Types.HereApi;

  public static create(init: {
    api: Types.HereApi;
    platform: H.service.Platform;
  }): GeoMapPlacesServiceHere {
    return new GeoMapPlacesServiceHere(init);
  }

  private constructor(init: {
    api: Types.HereApi;
    platform: H.service.Platform;
  }) {
    this.platform = init.platform;
    this.api = init.api;
  }

  public async get(
    id: string
  ): Promise<Types.Result<Types.GeoMapPlaceDetails>> {
    return new Promise<Types.Result<Types.GeoMapPlaceDetails>>(resolve => {
      const service = this.platform.getPlacesService();

      service.request(
        ('places/lookup' as any) as H.service.PlacesService.EntryPoint,
        { id, source: 'sharing', tf: 'plain' },
        (place: HerePlace) => {
          const address = place.location.address;

          resolve(
            Result.createSuccess({
              provider: Types.GeoMapProvider.Here,
              id,
              name: place.name,
              formattedAddress: address.text,
              address: {
                country: address.country,
                countryCode: address.countryCode,
                county: address.county,
                district: address.district,
                state: address.state,
                postalCode: address.postalCode,
                locality: address.city,
                route: address.street,
                streetNumber: address.house
              },
              location: {
                lat: place.location.position[0],
                lng: place.location.position[1]
              },
              icon: place.icon,
              permanentlyClosed: false
            })
          );
        },
        serviceError => resolve(Result.createFailure(serviceError))
      );
    });
  }

  public search(
    needle: string,
    center: Types.GeoPoint,
    radius?: number
  ): Promise<Types.Result<Types.GeoMapPlace[]>> {
    return new Promise(resolve => {
      const service = this.platform.getPlacesService();

      const point = [center.lat, center.lng].join(',');

      const params =
        typeof radius !== 'undefined'
          ? { in: `${point};r=${radius}` }
          : { at: point };

      service.search(
        { q: needle, tf: 'plain', ...params },
        response => {
          const { results } = response;

          if (typeof results === 'undefined' || !Array.isArray(results.items)) {
            resolve(Result.createSuccess([]));
          }

          const places = results.items.map(item => ({
            provider: Types.GeoMapProvider.Here,
            id: item.id,
            name: item.title,
            formattedAddress: item.vicinity,
            location: {
              lat: item.position[0],
              lng: item.position[1]
            }
          }));

          resolve(Result.createSuccess(places));
        },
        serviceError => resolve(Result.createFailure(serviceError))
      );
    });
  }

  public distanceBetween(
    from: Types.GeoPoint,
    to: Types.GeoPoint,
    radius?: number
  ): number {
    return new this.api.geo.Point(from.lat, from.lng).distance(
      new this.api.geo.Point(to.lat, to.lng)
    );
  }
}
