import * as Constants from './constants';
import * as Types from '../types';
import * as Util from './util';
import { injectBrowserCtx } from './integration-tests-utils';
import { createHereMap } from './create-here-map';
import { createGoogleMap } from './create-google-map';
import { GeoMap } from '../geo-map';
import { GeoMarker } from '..';

export const Tests2 = {
  styledPOIMarkerHome: injectBrowserCtx<
    string,
    Types.GeoPoint,
    Types.GeoMapConfig,
    GeoMarker
  >(
    async (
      browserCtx,
      icon: string = Constants.ICON,
      center = Constants.S2_HAM
    ) => {
      const gmap = await createGoogleMap({
        config: browserCtx,
        mountInit: { zoom: 10, center }
      });

      return await gmap.createMarker({
        ...browserCtx,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="31" height="45">
        <g fill="none" fill-rule="evenodd" stroke="#FFF" transform="translate(1 1)">
          <path fill="#000" d="M29 14.5c0 2.73-1.624 6.903-4.499 12.18a114.552 114.552 0 0 1-2.573 4.466 168.504 168.504 0 0 1-4.827 7.5 165.582 165.582 0 0 1-2.196 3.148l-.405.558-.405-.558a165.582 165.582 0 0 1-2.196-3.148 168.504 168.504 0 0 1-4.827-7.5A114.552 114.552 0 0 1 4.5 26.681C1.624 21.403 0 17.23 0 14.5 0 6.524 6.524 0 14.5 0S29 6.524 29 14.5z"/>
          <path d="M7.5 11v6.5a2 2 0 0 0 2 2h12V11"/>
          <polyline points="24 13 14.5 5.5 5 13"/>
        </g>
      </svg>`,
        position: center
      });
    }
  ),

  styledPOIMarkerFavorite: injectBrowserCtx<
    string,
    Types.GeoPoint,
    Types.GeoMapConfig,
    GeoMarker
  >(
    async (
      browserCtx,
      icon: string = Constants.ICON,
      center = Constants.S2_HAM
    ) => {
      const gmap = await createGoogleMap({
        config: browserCtx,
        mountInit: { zoom: 10, center }
      });

      return await gmap.createMarker({
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
        position: center
      });
    }
  ),

  styledPOIMarkerCar: injectBrowserCtx<
    string,
    Types.GeoPoint,
    Types.GeoMapConfig,
    GeoMarker
  >(
    async (
      browserCtx,
      icon: string = Constants.ICON,
      center = Constants.S2_HAM
    ) => {
      const gmap = await createGoogleMap({
        config: browserCtx,
        mountInit: { zoom: 10, center }
      });

      return await gmap.createMarker({
        ...browserCtx,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="31" height="45">
        <g fill="none" fill-rule="evenodd" stroke="#FFF" transform="translate(1 1)">
          <path fill="#000" d="M29 14.5c0 2.73-1.624 6.903-4.499 12.18a114.552 114.552 0 0 1-2.573 4.466 168.504 168.504 0 0 1-4.827 7.5 165.582 165.582 0 0 1-2.196 3.148l-.405.558-.405-.558a165.582 165.582 0 0 1-2.196-3.148 168.504 168.504 0 0 1-4.827-7.5A114.552 114.552 0 0 1 4.5 26.681C1.624 21.403 0 17.23 0 14.5 0 6.524 6.524 0 14.5 0S29 6.524 29 14.5z"/>
          <polygon points="5.031 8.516 6.812 8.516 7.347 8.516"/>
          <path d="M4.688 11.646s.734.193 1.644.45c.775.22 1.096.412 1.264 1.19.21.98.495 1.382-.927 1.108-1.422-.273-2.227-.513-2.227-.513M24.016 8.547H21.69M24.312 11.646s-.734.193-1.644.45c-.775.22-1.096.412-1.264 1.19-.21.98-.495 1.382.927 1.108 1.422-.273 2.227-.513 2.227-.513"/>
          <path d="M21.5 17.578v2.047h2.12c.477 0 .934-.382.943-.859v-4.164c0-3.299-.613-3.645-.613-3.645L22.668 10s-.703-.719-1.394-2.215C20.68 6.5 19.415 6.5 19.415 6.5h-9.83s-1.265 0-1.859 1.285C7.035 9.281 6.332 10 6.332 10l-1.244.93s-.051.034-.073.057c-.129.131-.577.792-.577 3.615v4.164c.008.477.465.86.942.86H7.5v-2.048h14z"/>
          <polygon points="17.917 12.875 19.211 13.738 17.953 15.5 11.143 15.5 9.793 13.738 11.143 12.875"/>
          <path d="M22.29 9.531H6.71"/>
        </g>
      </svg>`,
        position: center
      });
    }
  ),

  styledMarkerGoogle: injectBrowserCtx<
    string,
    Types.GeoPoint,
    Types.GeoMapConfig,
    GeoMarker
  >(
    async (
      browserCtx,
      icon: string = Constants.ICON,
      center = Constants.S2_HAM
    ) => {
      const gmap = await createGoogleMap({
        config: browserCtx,
        mountInit: { zoom: 18, center }
      });

      return await gmap.createMarker({
        ...browserCtx,
        icon: `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#4783DA" d="M30 60c16.569 0 30-13.431 30-30C60 13.431 46.569 0 30 0 13.431 0 0 13.431 0 30c0 16.569 13.431 30 30 30z" opacity=".15"/><circle cx="30" cy="30" r="8.5" fill="#3275D2" stroke="#FFF" stroke-width="3"/></g></svg>`,
        position: center
      });
    }
  ),

  markerGoogle: injectBrowserCtx<
    string,
    Types.GeoPoint,
    Types.GeoMapConfig,
    GeoMarker
  >(
    async (
      browserCtx,
      icon: string = Constants.ICON,
      center = Constants.S2_HAM
    ) => {
      const gmap = await createGoogleMap({
        config: browserCtx,
        mountInit: { zoom: 10, center }
      });
      await gmap.phase(Types.GeoMapPhase.Layouted);

      return await gmap.createMarker({
        ...browserCtx,
        icon,
        position: center
      });
    }
  ),

  markerHere: injectBrowserCtx<
    string,
    Types.GeoPoint,
    Types.GeoMapConfig,
    GeoMarker
  >(
    async (
      browserCtx,
      icon: string = Constants.ICON,
      center = Constants.S2_HAM
    ) => {
      const hmap = await createHereMap({
        config: browserCtx,
        mountInit: { zoom: 10, center }
      });

      return await hmap.createMarker({
        ...browserCtx,
        icon,
        position: center
      });
    }
  ),

  languageHere: injectBrowserCtx<string, Types.GeoMapConfig, GeoMap>(
    async (browserCtx, language = 'en') => {
      return createHereMap({
        config: {
          ...browserCtx,
          language
        },
        mountInit: { center: Constants.S2_HAM, zoom: 4 }
      });
    }
  ),

  languageGoogle: injectBrowserCtx<string, Types.GeoMapConfig, GeoMap>(
    async (browserCtx, language = 'en') => {
      return createGoogleMap({
        config: {
          ...browserCtx,
          language
        },
        mountInit: { center: Constants.S2_HAM, zoom: 4 }
      });
    }
  ),

  centerHere: injectBrowserCtx(
    async (
      browserCtx,
      { lat, lng }: { lat: number; lng: number } = { lat: 0, lng: 0 }
    ) => {
      const hmap = await createHereMap({
        config: browserCtx,
        mountInit: { center: Constants.S2_HAM, zoom: 5 }
      });
      await hmap.setCenter({
        lat,
        lng
      });
      return hmap.getCenter();
    }
  ),

  centerGoogle: injectBrowserCtx(
    async (
      browserCtx,
      { lat, lng }: { lat: number; lng: number } = { lat: 0, lng: 0 }
    ) => {
      const gmap = await createGoogleMap({
        config: browserCtx,
        mountInit: { center: Constants.S2_HAM, zoom: 5 }
      });
      await gmap.setCenter({
        lat,
        lng
      });
      return gmap.getCenter();
    }
  )
};
