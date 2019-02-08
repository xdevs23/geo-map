import * as Types from '.';

export type GeoMapWindow = Window & GeoMapContext & { google: typeof google };

export interface DOMContext {
  readonly window: GeoMapWindow;
  readonly global: {
    readonly DOMParser: DOMParser;
  };
}

export type BrowserCtx<T = unknown> = T & {
  readonly browserCtx: DOMContext;
};

export enum GeoMapProvider {
  Google = 'Google',
  Here = 'Here',
  Custom = 'Custom'
}
export type LoadGoogleMapConfig =
  | LoadGoogleMapConfigBase<GoogleMapApiKeyAuth>
  | LoadGoogleMapConfigBase<GoogleMapClientIdAuth>;

export type LoadMapConfig = LoadGoogleMapConfig | LoadHereMapConfig;
export type GoogleMapAuth = GoogleMapApiKeyAuth | GoogleMapClientIdAuth;

export enum GoogleMapAuthType {
  ApiKey = 'ApiKey',
  ClientId = 'ClientId'
}

export interface GoogleMapApiKeyAuth {
  readonly apiKey: string;
}

export interface GoogleMapClientIdAuth {
  readonly clientId: string;
  readonly channel?: string;
}

export type LoadGoogleMapConfigBase<T = undefined> = BrowserCtx<{
  readonly language?: string;
  readonly region?: string;
  readonly provider: GeoMapProvider.Google;
  viewport?: GeoMapViewport;
  readonly mapJsUrl?: string;
  readonly mapJsCallbackId?: string;
  readonly auth: T;
}>;

export interface LoadGoogleMapConfigDefault extends LoadGoogleMapConfigBase {
  readonly apiKey: string;
}

export type LoadHereMapConfig = BrowserCtx<{
  readonly appCode: string;
  readonly appId: string;
  readonly language?: string;
  readonly provider: GeoMapProvider.Here;
  readonly region?: string;
  viewport?: GeoMapViewport;
}>;

export interface GeoMapViewport {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type LoadMapResult =
  | LoadGoogleMapResult
  | LoadHereMapResult
  | LoadCustomMapResult;

export interface LoadGoogleMapResult {
  result: Types.Result<typeof google.maps>;
  readonly provider: GeoMapProvider.Google;
}

export interface LoadHereMapResult {
  result: Types.Result<typeof H>;
  readonly provider: GeoMapProvider.Here;
}

export interface LoadCustomMapResult {
  // tslint:disable-next-line:no-any
  result: Types.Result<any>;
  readonly provider: GeoMapProvider.Custom;
}

export interface LoadMapContext {
  init?(): GeoMapApi;
}

export type GeoMapConfig = LoadGoogleMapConfig | LoadHereMapConfig;

export type GeoMapInit = GoogleGeoMapInit | HereGeoMapInit | CustomGeoMapInit;

export type GeoMapCtx<T> = T & { readonly geoMapCtx?: GeoMapContext };

export type GeoMapImplementationAttribute<T> = T & {
  readonly implementation?: GeoMapImplementation;
};

export type GoogleGeoMapInit = GeoMapImplementationAttribute<
  GeoMapCtx<
    BrowserCtx<{
      readonly provider: GeoMapProvider.Google;
    }>
  >
>;

export type HereGeoMapInit = GeoMapImplementationAttribute<
  GeoMapCtx<
    BrowserCtx<{
      readonly provider: GeoMapProvider.Here;
    }>
  >
>;

export type CustomGeoMapInit = GeoMapImplementationAttribute<
  GeoMapCtx<
    BrowserCtx<{
      readonly provider: GeoMapProvider.Custom;
    }>
  >
>;

export interface GeoMapImplementation {
  load(): Promise<LoadMapResult>;
  mount(el: HTMLElement, mountInit: GeoMapMountInit): Promise<void>;
  phase(phase: GeoMapPhase): Promise<void>;
  getCenter(): Promise<GeoPoint>;
  setCenter(center: GeoPoint): Promise<void>;
  getLayer(): Promise<GeoLayer>;
  setLayer(layer: GeoLayer): Promise<void>;
  getMarkers(): Promise<GeoMarkerImplementation[]>;
  getType(): Promise<GeoMapType>;
  setType(type: GeoMapType): Promise<void>;
  setViewport(viewport: GeoMapViewport): Promise<void>;
  getViewBounds(): Promise<GeoBounds>;
  setViewBounds(bounds: GeoBounds): Promise<void>;
  getZoom(): Promise<number>;
  setZoom(zoomFactor: number): Promise<void>;

  addEventListener(
    eventName: Types.GeoEvent.Click,
    handler: Types.GeoEventHandler<Types.GeoClickPayload>
  ): Promise<void>;
  addEventListener(
    eventName: Types.GeoEvent.Changed,
    handler: Types.GeoEventHandler<void>
  ): Promise<void>;
  addEventListener(
    name: GeoEvent,
    handler: Types.GeoEventHandler
  ): Promise<void>;

  coversLocation(point: Types.GeoPoint): Promise<boolean>;
}

export enum PlaceType {
  Unknown = 0x0,
  Removed = 0x1,
  Car = 0x2,
  Favorit = 0x4,
  LastUsed = 0x8
}

export interface PlaceInit {
  type?: PlaceType;
  readonly id?: string;
}

export interface Place {
  readonly type: PlaceType;
  readonly id: string;
  equal(oth: Place): boolean;
}

export type GoogleApi = typeof google.maps;
export type HereApi = typeof H;

export type GoogleMap = google.maps.Map;
export type HereMap = H.Map;

export type GeoMapApi = GoogleApi | HereApi;

export interface GeoMapContext extends LoadMapContext {
  changed?(geoMapApi: google.maps.Map | H.Map): Promise<void>;
  // tslint:disable-next-line:no-any
  load?(config: GeoMapConfig, ctx?: GeoMapContext): Promise<any>;
  loaded?(
    geoMapApi: google.maps.Map | H.Map,
    ctx: { api: GeoMapApi; geoMapCtx: GeoMapContext }
  ): Promise<void>;
}

export interface GeoPoint {
  readonly lat: number;
  readonly lng: number;
}

export interface GeoMapMountInit {
  readonly center: GeoPoint;
  readonly type?: GeoMapType;
  readonly layer?: GeoLayer;
  readonly zoom?: number;
}

export enum GeoMapType {
  Roadmap = 'Roadmap',
  Hybrid = 'Hybrid',
  Unknown = 'Unknown'
}

export enum GeoLayer {
  Transit = 'Transit',
  Traffic = 'Traffic',
  None = 'None'
}

export interface GeoMarkerImplementation {
  getIcon(): Promise<string>;
  setIcon(svg: string): Promise<Types.Result<void>>;
  getPosition(): Promise<Types.GeoPoint>;
  setPosition(position: GeoPoint): Promise<void>;
  remove(): Promise<void>;
}

export interface GeoMarkerInit {
  readonly provider: GeoMapProvider;
  readonly implementation: GeoMarkerImplementation;
}

export enum GeoMarkerOrientation {
  Start,
  Middle,
  End
}

export interface GeoMarkerAnchor {
  readonly vertical: GeoMarkerOrientation;
  readonly horizontal: GeoMarkerOrientation;
}

export type GeoMarkerConfig = BrowserCtx<{
  readonly anchor?: GeoMarkerAnchor;
  readonly position: GeoPoint;
  readonly icon: string;
}>;

export interface GeoMarkerCreateInit extends GeoMarkerConfig {
  readonly provider: GeoMapProvider;
  readonly mapImplementation: GeoMapImplementation;
}

export interface HereMarkerContext {
  readonly mapImplementation: GeoMapImplementation;
}

export interface GoogleMarkerContext {
  readonly mapImplementation: GeoMapImplementation;
}

export type GeoMarkerContext = HereMarkerContext | GoogleMarkerContext;

export enum HerePixelDensity {
  Default = 72,
  HighRes = 320,
  UltraHighRes = 500
}
export enum HereLanguage {
  ar = 'ara',
  eu = 'baq',
  ca = 'cat',
  zh = 'chi',
  cs = 'cze',
  da = 'dan',
  nl = 'dut',
  en = 'eng',
  fi = 'fin',
  fr = 'fre',
  de = 'ger',
  ga = 'gle',
  el = 'gre',
  he = 'heb',
  hi = 'hin',
  id = 'ind',
  it = 'ita',
  no = 'nor',
  fa = 'per',
  pl = 'pol',
  pt = 'por',
  ru = 'rus',
  si = 'sin',
  es = 'spa',
  sw = 'swe',
  th = 'tha',
  tr = 'tur',
  uk = 'ukr',
  ur = 'urd',
  vi = 'vie',
  cy = 'wel',
  Multiple = 'mul'
}

export interface GeoBounds {
  readonly north: number;
  readonly east: number;
  readonly south: number;
  readonly west: number;
}

export interface GeoRectInit {
  readonly implementation: GeoRectImplementation;
  readonly provider: GeoMapProvider;
}

export interface GeoRectCreateInit<T extends GeoMapProvider = GeoMapProvider>
  extends GeoBounds {
  readonly provider: T;
}

export interface GeoRectImplementation {
  getBounds(): Promise<GeoBounds>;
  coversLocation(point: Types.GeoPoint): Promise<boolean>;
}

export interface RectContext {
  readonly mapImplementation: GeoMapImplementation;
}

export interface CircleContext {
  readonly mapImplementation: GeoMapImplementation;
}

export interface GoogleRectContext {
  readonly api: GoogleApi;
}

export interface HereRectContext {
  readonly api: HereApi;
}

export enum GeoMapPhase {
  Pristine = 'pristine',
  Loading = 'loading',
  Loaded = 'loaded',
  Mounting = 'mounting',
  Mounted = 'mounted',
  Layouting = 'layouting',
  Layouted = 'layouted'
}

export interface GeoCircleImplementation {
  getBounds(): Promise<GeoBounds>;
}

export interface GeoCircleInit {
  readonly provider: GeoMapProvider;
  readonly implementation: GeoCircleImplementation;
}

export interface GeoCircleCreateInit {
  readonly provider: GeoMapProvider;
  /** LatLng position of the circle's center */
  readonly position: GeoPoint;
  /** Radius of the circle in meters */
  readonly radius: number;
}

export interface GeoCircleConfig {
  /** LatLng position of the circle's center */
  readonly position: GeoPoint;
  /** Radius of the circle in meters */
  readonly radius: number;
}

export enum GeoEvent {
  Click = 'click',
  Changed = 'changed',
  Loaded = 'tilesloaded'
}

// tslint:disable-next-line:no-empty-interface
export type GeoEventPayload = GeoClickPayload;

export interface GeoClickPayload {
  readonly position: {
    readonly lat: number;
    readonly lng: number;
  };
}

// tslint:disable-next-line:no-any
export type GeoEventHandler<T extends GeoEventPayload | void = any> = (
  e?: T
) => void;

export interface GeoMapCodingServiceImplementation {
  reverse(point: GeoPoint): Promise<Types.Result<GeoMapPlaceDetails[]>>;
}

export interface GeoMapDirectionResult {
  readonly start: Types.GeoPoint;
  readonly end: Types.GeoPoint;
}

export interface GeoMapDirectionServiceImplementation {
  /**
   * @param from The route origin
   * @param to The route destination
   * @return The route start- and endpoint of the calculated route.
   *          This may slightly differ from the given start and endpoint.
   */
  paintRoute(
    from: Types.GeoPoint,
    to: Types.GeoPoint
  ): Promise<GeoMapDirectionResult>;

  /**
   * Removes all drawings from the map
   */
  clear(): Promise<void>;
}

export interface GeoMapPlacesServiceImplementation {
  get(id: string): Promise<Types.Result<GeoMapPlaceDetails>>;

  search(
    needle: string,
    center: Types.GeoPoint,
    radius: number
  ): Promise<Types.Result<GeoMapPlace[]>>;

  distanceBetween(
    from: Types.GeoPoint,
    to: Types.GeoPoint,
    radius?: number
  ): number;
}

export interface GeoMapPlaceDetails {
  readonly provider: Types.GeoMapProvider;
  readonly id: string;
  readonly name?: string;
  readonly address: {
    readonly country: string | undefined;
    readonly countryCode: string | undefined;
    readonly county: string | undefined;
    readonly district: string | undefined;
    readonly state: string | undefined;
    readonly postalCode: string | undefined;
    readonly locality: string | undefined;
    readonly route: string | undefined;
    readonly streetNumber: string | undefined;
  };
  readonly formattedAddress: string;
  readonly location?: Types.GeoPoint;
  readonly icon?: string;
  readonly permanentlyClosed?: boolean;
  readonly type?: string[];
  readonly formattedPhoneNumber?: string;
  readonly website?: string;
}

export interface GeoMapPlace {
  readonly provider: Types.GeoMapProvider;
  readonly name: string;
  readonly id: string;
  readonly formattedAddress: string;
  readonly location: {
    readonly lat: number;
    readonly lng: number;
  };
}
