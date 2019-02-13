import * as Constants from './constants';
import * as Types from '../types';
import * as Util from './util';
import { VIEWPORT, BOUNDS } from './integration-tests-utils';
import { createHereMap } from './create-here-map';
import { createGoogleMap } from './create-google-map';
import { injectBrowserCtx } from './integration-tests-utils';

export const Tests3 = {
  viewportHere: injectBrowserCtx(
    async (browserCtx, viewport: Types.GeoMapViewport = VIEWPORT) => {
      const hmap = await createHereMap({
        config: { ...browserCtx, viewport },
        mountInit: { center: Constants.S2_HAM, zoom: 5 }
      });

      const el = document.querySelector(
        `[data-map="${Types.GeoMapProvider.Here}"]`
      ) as HTMLElement;

      Util.paintViewport({
        context: browserCtx.browserCtx,
        viewport,
        container: el
      });

      return await hmap.createMarker({
        ...browserCtx,
        icon: Constants.ICON,
        position: Constants.S2_HAM
      });
    }
  ),

  viewportGoogle: injectBrowserCtx(
    async (browserCtx, viewport: Types.GeoMapViewport = VIEWPORT) => {
      const gmap = await createGoogleMap({
        config: { ...browserCtx, viewport },
        mountInit: { center: Constants.S2_HAM, zoom: 5 }
      });

      const el = document.querySelector(
        `[data-map="${Types.GeoMapProvider.Google}"]`
      ) as HTMLElement;

      Util.paintViewport({
        context: browserCtx.browserCtx,
        viewport,
        container: el
      });

      return await gmap.createMarker({
        ...browserCtx,
        icon: Constants.ICON,
        position: Constants.S2_HAM
      });
    }
  ),

  boundsHere: injectBrowserCtx(
    async (
      browserCtx,
      viewport: Types.GeoMapViewport = VIEWPORT,
      bounds: Types.GeoBounds = BOUNDS
    ) => {
      const hmap = await createHereMap({
        config: {
          ...browserCtx,
          viewport: { top: 0, right: 0, bottom: 0, left: 300 }
        },
        mountInit: { center: { lat: 0, lng: 0 }, zoom: 5 }
      });

      hmap.createMarker({
        ...browserCtx,
        position: { lat: bounds.north, lng: bounds.east },
        icon: Constants.ICON
      });
      hmap.createMarker({
        ...browserCtx,
        position: { lat: bounds.south, lng: bounds.west },
        icon: Constants.ICON
      });

      await hmap.setViewBounds(bounds);
    }
  ),

  boundsGoogle: injectBrowserCtx(
    async (
      browserCtx,
      viewport: Types.GeoMapViewport = VIEWPORT,
      bounds: Types.GeoBounds = BOUNDS
    ) => {
      const googleMap = await createGoogleMap({
        config: { ...browserCtx, viewport },
        mountInit: { center: { lat: 0, lng: 0 }, zoom: 5 }
      });

      googleMap.createMarker({
        ...browserCtx,
        position: { lat: bounds.north, lng: bounds.east },
        icon: Constants.ICON
      });

      googleMap.createMarker({
        ...browserCtx,
        position: { lat: bounds.south, lng: bounds.west },
        icon: Constants.ICON
      });

      await googleMap.setViewBounds(bounds);
    }
  ),

  routeGoogle: injectBrowserCtx(async browserCtx => {
    const googleMap = await createGoogleMap({
      config: browserCtx,
      mountInit: { center: Constants.S2_FRA, zoom: 5 }
    });

    // tslint:disable-next-line:no-any
    const map = ((googleMap as any).implementation as { map: google.maps.Map })
      .map;

    const directionsService = new google.maps.DirectionsService();

    const config = {
      origin: Constants.S2_HAM,
      destination: Constants.S2_MUC,
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(config, results => {
      const [route] = results.routes;

      const path = route.legs.reduce(
        (p, leg) => leg.steps.reduce((ps, s) => [...ps, ...s.path], p),
        []
      );

      const lineBackground = new google.maps.Polyline({
        path,
        strokeColor: 'rgb(51, 121, 195)',
        strokeOpacity: 1.0,
        strokeWeight: 8
      });

      const lineForegroud = new google.maps.Polyline({
        path,
        strokeColor: 'rgb(0, 179, 253)',
        strokeOpacity: 1.0,
        strokeWeight: 5
      });

      lineBackground.setMap(map);
      lineForegroud.setMap(map);

      googleMap.createMarker({
        ...browserCtx,
        position: config.origin,
        icon: Constants.ORIGIN_ICON
      });

      googleMap.createMarker({
        ...browserCtx,
        position: config.destination,
        icon: Constants.TARGET_ICON
      });
    });
  }),

  routeHere: injectBrowserCtx(async browserCtx => {
    const hereMap = await createHereMap({
      config: browserCtx,
      mountInit: { center: Constants.S2_FRA, zoom: 5 }
    });

    // tslint:disable-next-line:no-any
    const map = ((hereMap as any).implementation as { map: H.Map }).map;

    // tslint:disable-next-line:no-any
    const platform = ((hereMap as any).implementation as {
      platform: H.service.Platform;
    }).platform;

    const directionsService = platform.getRoutingService();

    const origin = Constants.S2_HAM;
    const destination = Constants.S2_MUC;

    const config = {
      mode: 'fastest;car',
      waypoint0: `geo!${origin.lat},${origin.lng}`,
      waypoint1: `geo!${destination.lat},${destination.lng}`,
      representation: 'display',
      routingParameters: 'display'
    };

    directionsService.calculateRoute(
      config,
      (result: H.service.ServiceResult) => {
        if (!result.response || !result.response.route) {
          return;
        }

        const [route] = result.response.route;

        const path = route.shape.reduce(
          // tslint:disable-next-line:no-any
          (p: [number, number, any], point: string) => [
            ...p,
            ...point.split(',').map(c => parseFloat(c)),
            undefined
          ],
          []
        );

        const lineBackground = new H.map.Polyline(new H.geo.LineString(path), {
          style: {
            lineWidth: 6,
            strokeColor: 'rgb(255, 255, 255)'
          }
        });

        const lineForegroud = new H.map.Polyline(new H.geo.LineString(path), {
          style: {
            lineWidth: 4,
            strokeColor: 'rgb(44, 72, 161)'
          }
        });

        map.addObject(lineBackground);
        map.addObject(lineForegroud);

        hereMap.createMarker({
          ...browserCtx,
          position: origin,
          icon: Constants.ORIGIN_ICON
        });

        hereMap.createMarker({
          ...browserCtx,
          position: destination,
          icon: Constants.TARGET_ICON
        });
      },
      (error: Error) => {
        console.error(error);
      }
    );
  })
};
