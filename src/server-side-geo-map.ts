import * as Types from './types';

export class ServerSideGeoMap implements Types.GeoMapImplementation {
  public constructor(_: Types.GeoMapConfig) {
    /* */
  }

  public async load(): Promise<Types.LoadMapResult> {
    // tslint:disable-next-line:no-any
    return {} as any;
  }
  public async mount(
    el: HTMLElement,
    mountInit: Types.GeoMapMountInit
  ): Promise<void> {
    /** */
  }
  public async phase(phase: Types.GeoMapPhase): Promise<void> {
    /** */
  }
  public async getCenter(): Promise<Types.GeoPoint> {
    return { lat: 0, lng: 0 };
  }
  public async setCenter(center: Types.GeoPoint): Promise<void> {
    /** */
  }
  public async getMarkers(): Promise<Types.GeoMarkerImplementation[]> {
    return [];
  }
  public async getLayer(): Promise<Types.GeoLayer> {
    return Types.GeoLayer.None;
  }
  public async setLayer(layer: Types.GeoLayer): Promise<void> {
    /** */
  }
  public async getType(): Promise<Types.GeoMapType> {
    return Types.GeoMapType.Unknown;
  }
  public async setType(type: Types.GeoMapType): Promise<void> {
    /** */
  }
  public async getViewBounds(): Promise<Types.GeoBounds> {
    return { north: 0, east: 0, south: 0, west: 0 };
  }
  public async setViewBounds(bounds: Types.GeoBounds): Promise<void> {
    /** */
  }
  public async setViewport(viewport: Types.GeoMapViewport): Promise<void> {
    /** */
  }
  public async getZoom(): Promise<number> {
    return 0;
  }
  public async setZoom(zoomFactor: number): Promise<void> {
    /** */
  }
  public async addEventListener(): Promise<void> {
    /***/
  }
  public async coversLocation(): Promise<boolean> {
    return false;
  }
}
