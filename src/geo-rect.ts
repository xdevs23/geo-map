import { GeoRectGoogle } from './geo-rect-google';
import { GeoRectHere } from './geo-rect-here';
import * as Types from './types';

export class GeoRect {
  private implementation: Types.GeoRectImplementation;

  public static create(init: Types.GeoRectCreateInit, context: Types.RectContext): GeoRect {
    const { north, east, south, west } = init;
    const data = { north, east, south, west };

    if (init.provider === Types.GeoMapProvider.Here) {
      return new GeoRect({
        provider: Types.GeoMapProvider.Here,
        implementation: GeoRectHere.create(data, context)
      });
    }

    return new GeoRect({
      provider: Types.GeoMapProvider.Google,
      implementation: GeoRectGoogle.create(data, context)
    });
  }

  private constructor(init: Types.GeoRectInit) {
    this.implementation = init.implementation;
  }

  public async getBounds(): Promise<Types.GeoBounds> {
    return this.implementation.getBounds();
  }
}
