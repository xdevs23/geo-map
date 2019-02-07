import { GeoRectGoogle } from './geo-rect-google';
import * as Test from './test';

test(
  'Google rect accepts constructor bounds',
  Test.domContextify(async context => {
    const { map: mapImplementation } = await Test.createGoogleMapImplementation(
      {
        mount: { zoom: 2, center: Test.Constants.S2_HAM },
        context
      }
    );

    const rect = GeoRectGoogle.create(
      { north: 0, east: 1, south: 1, west: 0 },
      { mapImplementation }
    );

    const actual = await rect.getBounds();
    const expected = { north: 0, east: 1, south: 1, west: 0 };

    expect(actual).toEqual(expected);
  })
);
