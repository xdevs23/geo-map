import * as Constants from './constants';
import * as Types from '../types';
import * as Util from './util';
import { injectBrowserCtx } from './integration-tests-utils';
import { createHereMap } from './create-here-map';
import { createGoogleMap } from './create-google-map';
import { MockFn } from './mock-fn';

export const Tests5 = {
  getHere: injectBrowserCtx(async (browserCtx, term: string = 'Hamburg') => {
    const center = Constants.S2_HAM;
    const map = await createHereMap({
      config: browserCtx,
      mountInit: { center, zoom: 15 }
    });
    const results = await map.search(term, center);

    if (
      results.type !== Types.ResultType.Success ||
      results.payload.length === 0
    ) {
      return;
    }

    const details = await map.getPlace(results.payload[0].id);

    if (details.type === Types.ResultType.Success) {
      Util.dump(browserCtx, details.payload);
    }
  }),

  getAllWayDownFromReverseGeocode: injectBrowserCtx(async browserCtx => {
    const center = Constants.S2_HAM;
    const map = await createHereMap({
      config: browserCtx,
      mountInit: { center, zoom: 15 }
    });
    const geocodeResult = await map.reverseGeocode(center);
    if (
      geocodeResult.type !== Types.ResultType.Success ||
      geocodeResult.payload.length === 0
    ) {
      throw new Error('Expected success from reverse geocode');
    }
    const firstResult = geocodeResult.payload[0];

    const placeResult = await map.getPlace(firstResult.id);
    if (placeResult.type !== Types.ResultType.Success) {
      throw new Error('Expected success from getPlace');
    }
    Util.dump(browserCtx, placeResult.payload);
  }),

  paintGoogleRoute: injectBrowserCtx(async browserCtx => {
    const map = await createGoogleMap({
      config: browserCtx,
      mountInit: { zoom: 8, center: { lat: 53.0572754, lng: 11.4263859 } }
    });

    const result = await map.paintRoute(Constants.S2_HAM, Constants.S2_BER);

    Util.dump(browserCtx, result);
  }),

  paintHereRoute: injectBrowserCtx(async browserCtx => {
    const map = await createHereMap({
      config: browserCtx,
      mountInit: {
        zoom: 8,
        center: { lat: 53.0572754, lng: 11.4263859 }
      }
    });

    const result = await map.paintRoute(Constants.S2_HAM, Constants.S2_BER);

    Util.dump(browserCtx, result);
  }),

  googleCreateMarkerFiresChange: injectBrowserCtx(async browserCtx => {
    // 'Geo createMarker triggers change event with Google',
    const googleMap = await createGoogleMap({
      config: browserCtx
    });
    const onChange = MockFn();
    await new Promise(async rs => {
      googleMap.addEventListener(Types.GeoEvent.Changed, () => {
        onChange();
        rs();
      });

      await googleMap.createMarker({
        browserCtx: browserCtx.browserCtx,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="31" height="45">
        <defs>
          <polygon id="a" points="14.5 5.5 17.281 11.135 23.5 12.039 19 16.425 20.062 22.619 14.5 19.695 8.938 22.619 10 16.425 5.5 12.039 11.719 11.135"/>
        </defs>
        <g fill="none" fill-rule="evenodd">
          <path fill="#000" stroke="#FFF" d="M30 15.5c0 2.736-1.618 6.9-4.48 12.162a113.78 113.78 0 0 1-2.592 4.496A167.454 167.454 0 0 1 18.1 39.65a164.435 164.435 0 0 1-2.197 3.144l-.404.557-.404-.557A164.435 164.435 0 0 1 12.9 39.65a167.454 167.454 0 0 1-4.828-7.492 113.78 113.78 0 0 1-2.591-4.496C2.618 22.4 1 18.236 1 15.5 1 7.492 7.492 1 15.5 1S30 7.492 30 15.5z"/>
          <g transform="translate(1 1)">
            <use fill="#000" stroke="#000" xlink:href="#a"/>
            <use stroke="#FFF" xlink:href="#a"/>
          </g>
        </g>
      </svg>`,
        position: Constants.S2_HAM
      });
    });
    Util.dump(browserCtx, onChange.mock.calls);
  }),

  hereCreateMarkerFiresChange: injectBrowserCtx(async browserCtx => {
    // 'Geo createMarker triggers change event with HERE',
    const hereMap = await createHereMap({
      config: browserCtx
    });
    const onChange = MockFn();

    hereMap.addEventListener(Types.GeoEvent.Changed, onChange);

    await hereMap.createMarker({
      ...browserCtx,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="31" height="45">
        <defs>
          <polygon id="a" points="14.5 5.5 17.281 11.135 23.5 12.039 19 16.425 20.062 22.619 14.5 19.695 8.938 22.619 10 16.425 5.5 12.039 11.719 11.135"/>
        </defs>
        <g fill="none" fill-rule="evenodd">
          <path fill="#000" stroke="#FFF" d="M30 15.5c0 2.736-1.618 6.9-4.48 12.162a113.78 113.78 0 0 1-2.592 4.496A167.454 167.454 0 0 1 18.1 39.65a164.435 164.435 0 0 1-2.197 3.144l-.404.557-.404-.557A164.435 164.435 0 0 1 12.9 39.65a167.454 167.454 0 0 1-4.828-7.492 113.78 113.78 0 0 1-2.591-4.496C2.618 22.4 1 18.236 1 15.5 1 7.492 7.492 1 15.5 1S30 7.492 30 15.5z"/>
          <g transform="translate(1 1)">
            <use fill="#000" stroke="#000" xlink:href="#a"/>
            <use stroke="#FFF" xlink:href="#a"/>
          </g>
        </g>
      </svg>`,
      position: Constants.S2_HAM
    });

    Util.dump(browserCtx, onChange.mock.calls);
  }),

  googleRemoveMarkerFiresChange: injectBrowserCtx(async browserCtx => {
    // 'GeoMarker.remove triggers change event with Google',
    const googleMap = await createGoogleMap({
      config: browserCtx
    });
    const onChange = MockFn();

    googleMap.addEventListener(Types.GeoEvent.Changed, onChange);
    const marker = await googleMap.createMarker({
      ...browserCtx,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="31" height="45">
        <defs>
          <polygon id="a" points="14.5 5.5 17.281 11.135 23.5 12.039 19 16.425 20.062 22.619 14.5 19.695 8.938 22.619 10 16.425 5.5 12.039 11.719 11.135"/>
        </defs>
        <g fill="none" fill-rule="evenodd">
          <path fill="#000" stroke="#FFF" d="M30 15.5c0 2.736-1.618 6.9-4.48 12.162a113.78 113.78 0 0 1-2.592 4.496A167.454 167.454 0 0 1 18.1 39.65a164.435 164.435 0 0 1-2.197 3.144l-.404.557-.404-.557A164.435 164.435 0 0 1 12.9 39.65a167.454 167.454 0 0 1-4.828-7.492 113.78 113.78 0 0 1-2.591-4.496C2.618 22.4 1 18.236 1 15.5 1 7.492 7.492 1 15.5 1S30 7.492 30 15.5z"/>
          <g transform="translate(1 1)">
            <use fill="#000" stroke="#000" xlink:href="#a"/>
            <use stroke="#FFF" xlink:href="#a"/>
          </g>
        </g>
      </svg>`,
      position: Constants.S2_HAM
    });

    await marker.remove();
    Util.dump(browserCtx, onChange.mock.calls);
  }),

  hereRemoveMarkerFiresChange: injectBrowserCtx(async browserCtx => {
    // 'GeoMarker.remove triggers change event with HERE',
    const hereMap = await createHereMap({
      config: browserCtx
    });
    const onChange = MockFn();

    hereMap.addEventListener(Types.GeoEvent.Changed, onChange);
    const marker = await hereMap.createMarker({
      browserCtx: browserCtx.browserCtx,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="31" height="45">
        <defs>
          <polygon id="a" points="14.5 5.5 17.281 11.135 23.5 12.039 19 16.425 20.062 22.619 14.5 19.695 8.938 22.619 10 16.425 5.5 12.039 11.719 11.135"/>
        </defs>
        <g fill="none" fill-rule="evenodd">
          <path fill="#000" stroke="#FFF" d="M30 15.5c0 2.736-1.618 6.9-4.48 12.162a113.78 113.78 0 0 1-2.592 4.496A167.454 167.454 0 0 1 18.1 39.65a164.435 164.435 0 0 1-2.197 3.144l-.404.557-.404-.557A164.435 164.435 0 0 1 12.9 39.65a167.454 167.454 0 0 1-4.828-7.492 113.78 113.78 0 0 1-2.591-4.496C2.618 22.4 1 18.236 1 15.5 1 7.492 7.492 1 15.5 1S30 7.492 30 15.5z"/>
          <g transform="translate(1 1)">
            <use fill="#000" stroke="#000" xlink:href="#a"/>
            <use stroke="#FFF" xlink:href="#a"/>
          </g>
        </g>
      </svg>`,
      position: Constants.S2_HAM
    });

    await marker.remove();
    Util.dump(browserCtx, onChange.mock.calls);
  })
};
