import * as QueryString from 'query-string';
import * as Result from '../result';
import * as Types from '../types';
import * as uuid from 'uuid';
import { rejects } from 'assert';

function googleMapCallbackId(): string {
  return `g${uuid
    .v4()
    .split('-')
    .join('')}`;
}

let memoizedGoogleMapResult: Types.LoadGoogleMapResult;

export function loadGoogleMapApi(
  result: Types.LoadGoogleMapResult,
  config: Types.LoadGoogleMapConfig,
  context?: Types.LoadMapContext
): Promise<Types.LoadGoogleMapResult> {
  return new Promise((resolve, rejects) => {
    // tslint:disable-next-line:no-any
    const win = config.browserCtx.window;

    if (win.google && typeof win.google.maps === 'object') {
      Result.toSuccess(
        result.result,
        context && context.init ? context.init() : win.google.maps
      );
      resolve(result);
      return;
    }

    const callbackFunctionName = (config.mapJsCallbackId && {
      functionName: config.mapJsCallbackId,
      toRemove: false
    }) || {
      functionName: googleMapCallbackId(),
      toRemove: true
    };
    const params: { [key: string]: string | null } = {
      callback: callbackFunctionName.functionName,
      language: config.language || 'en',
      region: config.region || null,
      libraries: 'places,geometry'
    };
    if (
      isAuthType<Types.GoogleMapApiKeyAuth>(
        config.auth,
        Types.GoogleMapAuthType.ApiKey
      )
    ) {
      params.key = config.auth.apiKey;
    } else if (
      isAuthType<Types.GoogleMapClientIdAuth>(
        config.auth,
        Types.GoogleMapAuthType.ClientId
      )
    ) {
      params.client = config.auth.clientId;
      params.channel = config.auth.channel || null;
    } else {
      const e = new Error(`Could not configure Google Maps authentication.`);
      rejects(e);
      return;
    }

    const url = `${config.mapJsUrl ||
      'https://maps.googleapis.com/maps/api/js'}?${QueryString.stringify(
      params
    )}`;

    const previous = win.document.querySelector(
      `[data-map-provider=${Types.GeoMapProvider.Google}]`
    );

    if (previous && memoizedGoogleMapResult) {
      return resolve(memoizedGoogleMapResult);
    }

    memoizedGoogleMapResult = result;

    // tslint:disable-next-line:no-any
    (win as any)[callbackFunctionName.functionName] = () => {
      Result.toSuccess(
        result.result,
        context && context.init ? context.init() : win.google.maps
      );
      resolve(result);
      if (callbackFunctionName.toRemove) {
        delete (win as any)[callbackFunctionName.functionName];
      }
    };
    const script = win.document.createElement('script');
    script.src = url;
    script.setAttribute('data-map-provider', Types.GeoMapProvider.Google);
    win.document.body.appendChild(script);
  });
}

function isAuthType<T extends Types.GoogleMapAuth>(
  auth: Types.GoogleMapAuth,
  type: Types.GoogleMapAuthType
): auth is T {
  if (type === Types.GoogleMapAuthType.ApiKey) {
    return auth.hasOwnProperty('apiKey');
  }

  if (type === Types.GoogleMapAuthType.ClientId) {
    return auth.hasOwnProperty('clientId');
  }

  return false;
}
