import { GeoRectGoogle } from './geo-rect-google';
import * as Test from './test';
import * as Types from './types';
import { GoogleMapImplationDonot } from './test';

Test.jestCreateGoogleMapImpl(async (donot: GoogleMapImplationDonot) => {
  test('Google rect accepts constructor bounds', async () => {
    const rect = GeoRectGoogle.create(
      { north: 0, east: 1, south: 1, west: 0 },
      { mapImplementation: donot.googleMap.map }
    );

    const actual = await rect.getBounds();
    const expected = { north: 0, east: 1, south: 1, west: 0 };

    expect(actual).toEqual(expected);
  });
});
