import { GeoMapGoogle } from './geo-map-google';
import * as Types from './types';

export class GeoRectGoogle implements Types.GeoRectImplementation {
  private api: Types.GoogleApi;
  private bounds: google.maps.LatLngBounds;

  public static create(
    data: Types.GeoBounds,
    context: Types.RectContext
  ): GeoRectGoogle {
    return new GeoRectGoogle(data, context);
  }

  public static from(
    bounds: google.maps.LatLngBounds,
    context: Types.RectContext
  ): GeoRectGoogle {
    return new GeoRectGoogle(bounds.toJSON(), context);
  }

  private constructor(bounds: Types.GeoBounds, context: Types.RectContext) {
    this.api = (context.mapImplementation as GeoMapGoogle).api;

    this.bounds = new this.api.LatLngBounds(
      new this.api.LatLng(bounds.south, bounds.west),
      new this.api.LatLng(bounds.north, bounds.east)
    );
    // this.bounds.extend(new this.api.LatLng(bounds.north, bounds.east));
    // this.bounds.extend(new this.api.LatLng(bounds.south, bounds.west));
  }

  public async getBounds(): Promise<Types.GeoBounds> {
    return this.bounds.toJSON();
  }

  public toBounds(): google.maps.LatLngBounds {
    return this.bounds;
  }

  public async coversLocation(point: Types.GeoPoint): Promise<boolean> {
    return this.bounds.contains(point);
  }
}
