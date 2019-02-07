import * as Test from './test';
import * as Types from './types';

// TODO: Check if we can reestablish support in JSDOM
// currently fails with "The Google Maps JavaScript API does not support this browser".
test(
  'Here map search result',
  Test.domContextify(async context => {
    const herePlaces = await Test.createHerePlacesImplementation({
      context,
      mock: false,
      mount: { center: Test.Constants.S2_HAM, type: Types.GeoMapType.Hybrid }
    });

    const result = await herePlaces.service.search(
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
