import * as Types from './types';
import { GeoMapPlacesServiceHere } from './geo-map-places-service-here';
import { GeoMapPlacesServiceGoogle } from './geo-map-places-service-google';
import { DOMContext } from './types';

export type GeoMapPlacesServiceCreateInit =
  | GeoMapPlacesServiceInitGoogle
  | GeoMapPlacesServiceInitHere;

export interface GeoMapContext {
  readonly context: DOMContext;
}

export interface GeoMapPlacesServiceInitGoogle extends GeoMapContext {
  readonly api: Types.GoogleApi;
  readonly type: Types.GeoMapProvider.Google;
}

export interface GeoMapPlacesServiceInitHere extends GeoMapContext {
  readonly api: Types.HereApi;
  readonly platform: H.service.Platform;
  readonly type: Types.GeoMapProvider.Here;
}

export interface GeoMapPlacesServiceInit extends GeoMapContext {
  readonly type: Types.GeoMapProvider;
  readonly implementation: Types.GeoMapPlacesServiceImplementation;
}

export class GeoMapPlacesService {
  private implementation: Types.GeoMapPlacesServiceImplementation;

  public static create(
    init: GeoMapPlacesServiceCreateInit
  ): GeoMapPlacesService {
    if (init.type === Types.GeoMapProvider.Here) {
      const hereApi = init.api as Types.HereApi;

      return new GeoMapPlacesService({
        type: init.type,
        context: init.context,
        implementation: GeoMapPlacesServiceHere.create({
          api: hereApi,
          platform: init.platform,
          context: init.context
        })
      });
    }

    const googleApi = init.api as Types.GoogleApi;

    return new GeoMapPlacesService({
      type: init.type,
      context: init.context,
      implementation: GeoMapPlacesServiceGoogle.create({
        api: googleApi,
        context: init.context
      })
    });
  }

  private constructor(init: GeoMapPlacesServiceInit) {
    this.implementation = init.implementation;
  }

  public async get(
    id: string
  ): Promise<Types.Result<Types.GeoMapPlaceDetails>> {
    return this.implementation.get(id);
  }

  public async search(
    needle: string,
    center: Types.GeoPoint,
    radius: number
  ): Promise<Types.Result<Types.GeoMapPlace[]>> {
    return this.implementation.search(needle, center, radius);
  }

  public distanceBetween(
    from: Types.GeoPoint,
    to: Types.GeoPoint,
    radius?: number
  ): number {
    return this.implementation.distanceBetween(from, to, radius);
  }
}
