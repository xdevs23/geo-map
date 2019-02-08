import * as Types from './types';
import { GeoMapPlacesServiceHere } from './geo-map-places-service-here';
import { GeoMapPlacesServiceGoogle } from './geo-map-places-service-google';
import { BrowserCtx } from './types';

export type GeoMapPlacesServiceCreateInit =
  | GeoMapPlacesServiceInitGoogle
  | GeoMapPlacesServiceInitHere;

export type GeoMapPlacesServiceInitGoogle = BrowserCtx<{
  readonly api: Types.GoogleApi;
  readonly type: Types.GeoMapProvider.Google;
}>;

export type GeoMapPlacesServiceInitHere = BrowserCtx<{
  readonly api: Types.HereApi;
  readonly platform: H.service.Platform;
  readonly type: Types.GeoMapProvider.Here;
}>;

export type GeoMapPlacesServiceInit = BrowserCtx<{
  readonly type: Types.GeoMapProvider;
  readonly implementation: Types.GeoMapPlacesServiceImplementation;
}>;

export class GeoMapPlacesService {
  private implementation: Types.GeoMapPlacesServiceImplementation;

  public static create(
    init: GeoMapPlacesServiceCreateInit
  ): GeoMapPlacesService {
    if (init.type === Types.GeoMapProvider.Here) {
      const hereApi = init.api as Types.HereApi;

      return new GeoMapPlacesService({
        type: init.type,
        browserCtx: init.browserCtx,
        implementation: GeoMapPlacesServiceHere.create({
          api: hereApi,
          platform: init.platform,
          browserCtx: init.browserCtx
        })
      });
    }

    const googleApi = init.api as Types.GoogleApi;

    return new GeoMapPlacesService({
      type: init.type,
      browserCtx: init.browserCtx,
      implementation: GeoMapPlacesServiceGoogle.create({
        api: googleApi,
        browserCtx: init.browserCtx
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
