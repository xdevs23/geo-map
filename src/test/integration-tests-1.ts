import * as Constants from './constants';
import * as Types from '../types';
import { injectBrowserCtx } from './integration-tests-utils';
import { createHereMap } from './create-here-map';
import { createGoogleMap } from './create-google-map';
import { browserCtxify } from './windowify';
import { GeoMap } from '../geo-map';
import { GeoPoint } from '../types';
import { GeoMarker } from '..';

export const Tests1 = {
  basicHere: injectBrowserCtx(async browserCtx => {
    const hereMap = await createHereMap({
      config: browserCtx
    });
  }),

  basicGoogle: injectBrowserCtx(async browserCtx => {
    const gmap = await createGoogleMap({
      config: browserCtx
    });
    await gmap.phase(Types.GeoMapPhase.Layouted);
  }),

  zoomGoogle: injectBrowserCtx<number, Types.GeoMapConfig, number>(
    async (browserCtx, zoom = 10) => {
      const gmap = await createGoogleMap({
        config: browserCtx
      });
      gmap.setZoom(zoom);
      return gmap.getZoom();
    }
  ),

  zoomHere: injectBrowserCtx<number, Types.GeoMapConfig, number>(
    async (browserCtx, zoom = 10) => {
      const hmap = await createHereMap({
        config: browserCtx
      });
      await hmap.setZoom(zoom);
      return hmap.getZoom();
    }
  ),

  zoomSameHere: injectBrowserCtx<number, Types.GeoMapConfig, number>(
    async (browserCtx, zoom = 5) => {
      const hmap = await createHereMap({
        config: browserCtx,
        mountInit: { zoom, center: Constants.S2_HAM }
      });
      await hmap.setZoom(zoom);
      const result = await hmap.getZoom();
      return result;
    }
  ),

  typeGoogle: injectBrowserCtx(
    async (browserCtx, type: Types.GeoMapType = Types.GeoMapType.Hybrid) => {
      const gmap = await createGoogleMap({
        config: browserCtx
      });
      gmap.setType(type);
      return gmap.getType();
    }
  ),

  typeHere: injectBrowserCtx(
    async (browserCtx, type: Types.GeoMapType = Types.GeoMapType.Hybrid) => {
      const hmap = await createHereMap({
        config: browserCtx,
        mountInit: { zoom: 2, center: Constants.S2_HAM }
      });
      hmap.setType(type);
      return hmap.getType();
    }
  ),

  styledPOIMarkerWork: injectBrowserCtx<
    string,
    GeoPoint,
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
          <polygon points="20.5 24.5 15.5 24.5 15.5 19.5 12.5 19.5 12.5 24.5 7.5 24.5 7.5 5.5 20.5 5.5"/>
          <polygon points="15.5 10.5 17.5 10.5 17.5 8.5 15.5 8.5"/>
          <polygon points="10.5 10.5 12.5 10.5 12.5 8.5 10.5 8.5"/>
          <polygon points="15.5 16.5 17.5 16.5 17.5 14.5 15.5 14.5"/>
          <polygon points="10.5 16.5 12.5 16.5 12.5 14.5 10.5 14.5"/>
        </g>
      </svg>`,
        position: center
      });
    }
  ),

  styledPOIMarkerAudi: injectBrowserCtx<
    string,
    GeoPoint,
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
        <g fill="none" fill-rule="evenodd" stroke="#FFF">
          <path fill="#000" d="M30 15.5c0 2.73-1.624 6.903-4.499 12.18a114.552 114.552 0 0 1-2.573 4.466 168.504 168.504 0 0 1-4.827 7.5 165.582 165.582 0 0 1-2.196 3.148l-.405.558-.405-.558a165.582 165.582 0 0 1-2.196-3.148 168.504 168.504 0 0 1-4.827-7.5A114.552 114.552 0 0 1 5.5 27.681C2.624 22.403 1 18.23 1 15.5 1 7.524 7.524 1 15.5 1S30 7.524 30 15.5z"/>
          <g stroke-linecap="round">
            <path d="M11.806 14.943a3.278 3.278 0 1 1-6.556 0 3.278 3.278 0 0 1 6.556 0z"/>
            <path d="M16.462 14.943a3.278 3.278 0 1 1-6.557 0 3.278 3.278 0 0 1 6.557 0z"/>
            <path d="M17.84 18.22a3.278 3.278 0 1 1 0-6.556 3.278 3.278 0 0 1 0 6.557z"/>
            <path d="M25.773 14.943a3.278 3.278 0 1 1-6.556 0 3.278 3.278 0 0 1 6.556 0z"/>
          </g>
        </g>
      </svg>`,
        position: center
      });
    }
  ),

  styledPOILastDestination: injectBrowserCtx<
    string,
    GeoPoint,
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
        icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="38" height="51">
      <defs>
        <path id="b" d="M28 14c0-7.732-6.268-14-14-14S0 6.268 0 14s14 27 14 27 14-19.268 14-27z"/>
        <filter id="a" width="157.1%" height="139%" x="-28.6%" y="-14.6%" filterUnits="objectBoundingBox">
          <feMorphology in="SourceAlpha" operator="dilate" radius="1" result="shadowSpreadOuter1"/>
          <feOffset dy="2" in="shadowSpreadOuter1" result="shadowOffsetOuter1"/>
          <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="2"/>
          <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"/>
          <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
        </filter>
      </defs>
      <g fill="none" fill-rule="evenodd">
        <g fill="#000" transform="translate(5 3)">
          <use filter="url(#a)" xlink:href="#b"/>
          <path stroke="#000" d="M28.5 14c0 2.736-1.618 6.9-4.48 12.162a113.78 113.78 0 0 1-2.592 4.496A167.454 167.454 0 0 1 16.6 38.15a164.435 164.435 0 0 1-2.197 3.144L14 41.85l-.404-.557A164.435 164.435 0 0 1 11.4 38.15a167.454 167.454 0 0 1-4.828-7.492 113.78 113.78 0 0 1-2.591-4.496C1.118 20.9-.5 16.736-.5 14-.5 5.992 5.992-.5 14-.5S28.5 5.992 28.5 14z"/>
        </g>
        <path stroke="#FFF" d="M12.426 20.667a7 7 0 1 0-.576-4.681m4.494 0h-5.461v-5.461"/>
      </g>
    </svg>`,
        position: center
      });
    }
  ),

  styledPOIMarkerDefault: injectBrowserCtx<
    string,
    GeoPoint,
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
        <g fill="#000" fill-rule="evenodd" stroke="#FFF">
          <path d="M30 15.5c0 2.736-1.618 6.9-4.48 12.162a113.78 113.78 0 0 1-2.592 4.496A167.454 167.454 0 0 1 18.1 39.65a164.435 164.435 0 0 1-2.197 3.144l-.404.557-.404-.557A164.435 164.435 0 0 1 12.9 39.65a167.454 167.454 0 0 1-4.828-7.492 113.78 113.78 0 0 1-2.591-4.496C2.618 22.4 1 18.236 1 15.5 1 7.492 7.492 1 15.5 1S30 7.492 30 15.5z"/>
          <path d="M22.5 15.5a7 7 0 1 0-14 0 7 7 0 0 0 14 0z"/>
        </g>
      </svg>`,
        position: center
      });
    }
  )
};
