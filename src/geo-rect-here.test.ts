import { GeoRectHere } from './geo-rect-here';
import * as Test from './test';

Test.jestCreateHereMapImpl(async (donot: Test.HereMapImplationDonot) => {
  // console.log('huhu=5');
  test('HERE rect accepts constructor bounds', async () => {
    const refBound = { north: 3, west: 2, south: -3, east: -2 };
    const rect = GeoRectHere.create(refBound, {
      mapImplementation: donot.hereMap.map
    });
    const actual = await rect.getBounds();
    expect(actual).toEqual(refBound);
  });

  test('HERE rect accepts from bounds', async () => {
    const rect = GeoRectHere.create(
      { north: 1, west: 2, south: 3, east: 4 },
      { mapImplementation: donot.hereMap.map }
    );
    const actual = await rect.getBounds();

    const rect1 = GeoRectHere.from(rect.toRect(), {
      mapImplementation: donot.hereMap.map
    });
    const actual1 = await rect1.getBounds();

    expect(actual).toEqual(actual1);
  });
  // console.log('exit=5');
});
