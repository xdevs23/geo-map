import * as Test from './test';
import * as Types from './types';

test(
  'Google map search result',
  Test.browserCtxify(async browserCtx => {
    const googlePlaces = await Test.createGooglePlacesImplementation({
      mock: false,
      mount: { center: Test.Constants.S2_HAM, type: Types.GeoMapType.Hybrid },
      config: {
        ...browserCtx
        /* helps to hack around the browser detection */
        // mapJsUrl: 'file:///home/menabe/Software/s2/geo-map/x.js',
        // mapJsCallbackId: 'g842a34aeb4c84c358ff3e877216c72c3'
      }
    });

    const result = await googlePlaces.service.search(
      'sinnerschrader',
      Test.Constants.S2_HAM,
      50000
    );

    expect(result).toEqual(
      expect.objectContaining({
        type: Types.ResultType.Success,
        payload: expect.arrayContaining([
          expect.objectContaining({
            name: expect.stringContaining('SinnerSchrader')
          })
        ])
      })
    );
  })
);
