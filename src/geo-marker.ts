import { GeoMarkerGoogle } from './geo-marker-google';
import { GeoMarkerHere } from './geo-marker-here';
import * as Types from './types';

export class GeoMarker {
  private readonly implementation: Types.GeoMarkerImplementation;

  public static create(init: Types.GeoMarkerCreateInit): GeoMarker {
    if (init.provider === Types.GeoMapProvider.Here) {
      return new GeoMarker({
        provider: Types.GeoMapProvider.Here,
        implementation: GeoMarkerHere.create(
          {
            browserCtx: init.browserCtx,
            position: init.position,
            icon: init.icon,
            anchor: init.anchor
          },
          {
            mapImplementation: init.mapImplementation
          }
        )
      });
    }

    return new GeoMarker({
      provider: Types.GeoMapProvider.Google,
      implementation: GeoMarkerGoogle.create(
        {
          browserCtx: init.browserCtx,
          position: init.position,
          icon: init.icon,
          anchor: init.anchor
        },
        { mapImplementation: init.mapImplementation }
      )
    });
  }

  private constructor(init: Types.GeoMarkerInit) {
    this.implementation = init.implementation;
  }

  public async getIcon(): Promise<string> {
    return this.implementation.getIcon();
  }

  public async setIcon(svg: string): Promise<Types.Result<void>> {
    return this.implementation.setIcon(svg);
  }

  public async getPosition(): Promise<Types.GeoPoint> {
    return this.implementation.getPosition();
  }

  public async setPosition(point: Types.GeoPoint): Promise<void> {
    return this.implementation.setPosition(point);
  }

  public async remove(): Promise<void> {
    return this.implementation.remove();
  }
}
