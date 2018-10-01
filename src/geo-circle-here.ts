import { GeoMapHere } from './geo-map-here';
import * as Types from './types';

export class GeoCircleHere implements Types.GeoCircleImplementation {
  private api: Types.HereApi;
  private circle: H.map.Circle;

  public static create(config: Types.GeoCircleConfig, context: Types.CircleContext): GeoCircleHere {
    return new GeoCircleHere(config, context);
  }

  private constructor(config: Types.GeoCircleConfig, context: Types.CircleContext) {
    const implementation = context.mapImplementation as GeoMapHere;
    this.api = implementation.api;

    this.circle = new this.api.map.Circle(config.position, config.radius);
    implementation.map.addObject(this.circle);
  }

  public async getBounds(): Promise<Types.GeoBounds> {
    const bounds = this.circle.getBounds();

    return {
      north: bounds.getTop(),
      east: bounds.getRight(),
      south: bounds.getBottom(),
      west: bounds.getLeft()
    };
  }
}
