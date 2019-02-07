import { GeoMarkerHere } from './geo-marker-here';
import * as Test from './test';

test(
  'respects initial icon',
  Test.domContextify(async context => {
    const { map: mapImplementation } = await Test.createHereMapImplementation({
      context
    });
    const icon = '<svg><text>Hello</text></svg>';

    const marker = GeoMarkerHere.create(
      {
        icon,
        position: Test.Constants.S2_HAM
      },
      { mapImplementation }
    );

    expect(await marker.getIcon()).toBe(icon);
  })
);

test(
  'may set icon',
  Test.domContextify(async context => {
    const { map: mapImplementation } = await Test.createHereMapImplementation({
      context
    });
    const icon = '<svg><text>Hello</text></svg>';

    const marker = GeoMarkerHere.create(
      { icon: '', position: Test.Constants.S2_HAM },
      { mapImplementation }
    );

    marker.setIcon(icon);
    expect(await marker.getIcon()).toBe(icon);
  })
);

test(
  'map hosts marker',
  Test.domContextify(async context => {
    const { map: mapImplementation } = await Test.createHereMapImplementation({
      context
    });

    const marker = GeoMarkerHere.create(
      { icon: '', position: Test.Constants.S2_HAM },
      { mapImplementation }
    );

    expect(await mapImplementation.getMarkers()).toContain(marker);
  })
);

test(
  'map looses removed marker',
  Test.domContextify(async context => {
    const { map: mapImplementation } = await Test.createHereMapImplementation({
      context
    });

    const marker = GeoMarkerHere.create(
      { icon: '', position: Test.Constants.S2_HAM },
      { mapImplementation }
    );

    expect(await mapImplementation.getMarkers()).toContain(marker);

    await marker.remove();

    expect(await mapImplementation.getMarkers()).not.toContain(marker);
  })
);
