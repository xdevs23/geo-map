import { GeoMapHere } from './geo-map-here';
import * as Types from './types';

export class GeoRectHere implements Types.GeoRectImplementation {
  private api: Types.HereApi;
  private rect: H.geo.Rect;

  public static create(data: Types.GeoBounds, context: Types.RectContext): GeoRectHere {
    return new GeoRectHere(data, context);
  }

  public static from(rect: H.geo.Rect, context: Types.RectContext): GeoRectHere {
    const data = {
      north: rect.getTop(),
      east: rect.getRight(),
      south: rect.getBottom(),
      west: rect.getLeft()
    };

    return new GeoRectHere(data, context);
  }

  private constructor(bounds: Types.GeoBounds, context: Types.RectContext) {
    const implementation = context.mapImplementation as GeoMapHere;
    this.api = implementation.api;
    this.rect = new this.api.geo.Rect(bounds.north, bounds.west, bounds.south, bounds.east);
  }

  public async coversLocation(point: Types.GeoPoint): Promise<boolean> {
    return this.rect.containsLatLng(point.lat, point.lng);
  }

  public async getBounds(): Promise<Types.GeoBounds> {
    return {
      north: this.rect.getTop(),
      east: this.rect.getRight(),
      south: this.rect.getBottom(),
      west: this.rect.getLeft()
    };
  }

  public toRect(): H.geo.Rect {
    return this.rect;
  }
}
