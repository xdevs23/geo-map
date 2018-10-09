import { loadGoogleMapApi } from './load-google-map-api';
import { loadHereMapApi } from './load-here-map-api';
import * as Result from '../result';
import * as Types from '../types';

export async function loadMapApi(
  config: Types.LoadHereMapConfig,
  context?: Types.LoadMapContext
): Promise<Types.LoadHereMapResult>;
export async function loadMapApi(
  config: Types.LoadGoogleMapConfig,
  context?: Types.LoadMapContext
): Promise<Types.LoadGoogleMapResult>;
export async function loadMapApi(
  config: Types.LoadMapConfig,
  context?: Types.LoadMapContext
): Promise<Types.LoadMapResult> {
  // tslint:disable-next-line:no-parameter-reassignment
  context = context || { window };
  context.window = context.window || window;

  switch (config.provider) {
    case Types.GeoMapProvider.Google: {
      const result: Types.LoadGoogleMapResult = {
        result: Result.createResult(),
        provider: config.provider
      };

      return loadGoogleMapApi(result, config, context);
    }

    case Types.GeoMapProvider.Here: {
      const result: Types.LoadHereMapResult = {
        result: Result.createResult(),
        provider: config.provider
      };

      return loadHereMapApi(result, config, context);
    }

    default: {
      // tslint:disable-next-line:no-any
      const faultyConfig = config as any;

      return {
        result: Result.toFailure(
          Result.createResult(),
          new Error(`Faulty map config: ${faultyConfig}`)
        ),
        provider: faultyConfig.provider
      };
    }
  }
}
