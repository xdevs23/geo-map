import { GeoCircleGoogle } from './geo-circle-google';
import { GeoCircleHere } from './geo-circle-here';
import * as Types from './types';

export class GeoCircle {
  private implementation: Types.GeoCircleImplementation;

  public static create(
    init: Types.GeoCircleCreateInit,
    context: Types.CircleContext
  ): GeoCircle {
    if (init.provider === Types.GeoMapProvider.Here) {
      return new GeoCircle({
        provider: Types.GeoMapProvider.Here,
        implementation: GeoCircleHere.create(
          {
            position: init.position,
            radius: init.radius
          },
          context
        )
      });
    }

    return new GeoCircle({
      provider: Types.GeoMapProvider.Google,
      implementation: GeoCircleGoogle.create(
        {
          position: init.position,
          radius: init.radius
        },
        context
      )
    });
  }

  private constructor(init: Types.GeoCircleInit) {
    this.implementation = init.implementation;
  }

  public async getBounds(): Promise<Types.GeoBounds> {
    return this.implementation.getBounds();
  }
}
