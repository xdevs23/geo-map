import { GeoMapGoogle } from './geo-map-google';
import * as Types from './types';

export class GeoCircleGoogle implements Types.GeoCircleImplementation {
  private circle: google.maps.Circle;

  public static create(
    config: Types.GeoCircleConfig,
    context: Types.CircleContext
  ): GeoCircleGoogle {
    return new GeoCircleGoogle(config, context);
  }

  private constructor(
    config: Types.GeoCircleConfig,
    context: Types.CircleContext
  ) {
    const implementation = context.mapImplementation as GeoMapGoogle;

    this.circle = new google.maps.Circle({
      center: config.position,
      radius: config.radius
    });

    this.circle.setMap(implementation.map);
  }

  public async getBounds(): Promise<Types.GeoBounds> {
    const bounds = this.circle.getBounds();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    return {
      north: northEast.lat(),
      east: northEast.lng(),
      south: southWest.lat(),
      west: southWest.lat()
    };
  }
}
