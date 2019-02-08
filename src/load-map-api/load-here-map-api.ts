import { loadScript } from './load-script';
import * as Result from '../result';
import * as Types from '../types';

const CORE_SCRIPT = 'https://js.api.here.com/v3/3.0/mapsjs-core.js';
const SERVICE_SCRIPT = 'https://js.api.here.com/v3/3.0/mapsjs-service.js';
const EVENTS_SCRIPT = 'https://js.api.here.com/v3/3.0/mapsjs-mapevents.js';

const SCRIPTS = [CORE_SCRIPT, SERVICE_SCRIPT, EVENTS_SCRIPT];

let memoizedHereMapResult: Types.LoadHereMapResult;

export async function loadHereMapApi(
  result: Types.LoadHereMapResult,
  config: Types.LoadHereMapConfig,
  context?: Types.LoadMapContext
): Promise<Types.LoadHereMapResult> {
  // tslint:disable-next-line:no-any
  const win = (config.browserCtx.window as any) as { H: typeof H };

  const load = (src: string) =>
    loadScript(src, { 'map-provider': config.provider }, config.browserCtx);
  const previous = config.browserCtx.window.document.querySelectorAll(
    `[data-map-provider=${config.provider}]`
  );
  const previousSources = Array.from(previous).map(p => p.getAttribute('src'));

  if (
    memoizedHereMapResult &&
    SCRIPTS.every(s => previousSources.indexOf(s) > -1)
  ) {
    return memoizedHereMapResult;
  }

  memoizedHereMapResult = result;

  await load(CORE_SCRIPT);

  await Promise.all([load(SERVICE_SCRIPT), load(EVENTS_SCRIPT)]);

  Result.toSuccess(result.result, context.init ? context.init() : win.H);
  return result;
}
