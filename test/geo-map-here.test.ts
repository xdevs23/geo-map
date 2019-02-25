import * as Fs from 'fs';
import * as TestEntry from '../src/test/integration-tests';
import * as Types from '../src/types';
import * as Util from '../src/test/util';

const TIMEOUT = 7500;

beforeAll(() => {
  if (!Fs.existsSync('./screenshots')) {
    Fs.mkdirSync('./screenshots');
  }

  page.setUserAgent(TestEntry.Constants.USER_AGENT);

  page.on('console', e => {
    if (e.text().startsWith('[HMR]') || e.text().startsWith('[WDS]')) {
      return;
    }
    console.log(e);
  });
});

beforeEach(async () => {
  await page.setViewport({ width: 800, height: 600 });
});

test(
  'GeoMap with HERE',
  async () => {
    await page.goto(`http://localhost:1338/?integration=true`);

    await page.evaluate(() => TestEntry.Tests.basicHere());

    await page.screenshot({ path: './screenshots/basic-here.png' });
    await expect(page).toMatch(/^© \d{4}.\d{4} HERE/);
  },
  TIMEOUT
);

test(
  'Zoom with Here',
  async () => {
    await page.goto(`http://localhost:1338/?integration=true`);

    const input = 1;
    const actual = await page.evaluate(
      factor => TestEntry.Tests.zoomHere(factor),
      input
    );

    await page.screenshot({ path: './screenshots/zoom-here.png' });
    expect(actual).toBe(1);
  },
  TIMEOUT
);

test(
  'Repeated zoom factor with Here',
  async () => {
    const repeated = 2;

    await page.goto(`http://localhost:1338/?integration=true`);
    const actual = await page.evaluate(
      zoom => TestEntry.Tests.zoomSameHere(zoom),
      repeated
    );

    await page.screenshot({ path: './screenshots/repeated-zoom-here.png' });
    expect(actual).toBe(repeated);
  },
  TIMEOUT
);

test(
  'Type with Here',
  async () => {
    await page.goto(`http://localhost:1338/?integration=true`);

    const input = Types.GeoMapType.Hybrid;
    const actual = await page.evaluate(
      type => TestEntry.Tests.typeHere(type),
      input
    );

    await page.screenshot({ path: './screenshots/type-here.png' });
    expect(actual).toBe(Types.GeoMapType.Hybrid);
  },
  TIMEOUT
);

test(
  'Marker with HERE has red marker at center',
  async () => {
    await page.goto(`http://localhost:1338/?integration=true`);
    await page.evaluate(() =>
      TestEntry.Tests.markerHere(
        TestEntry.Constants.ICON,
        TestEntry.Constants.S2_HAM
      )
    );

    const screenshot = await page.screenshot({
      path: './screenshots/marker-here.png'
    });
    const parsed = await Util.parsePng(screenshot);
    expect(parsed.getPixel(parsed.width / 2, parsed.height / 2)).toEqual([
      255,
      0,
      0,
      255
    ]);
  },
  TIMEOUT
);

test(
  'Viewport with HERE has red marker at offset center',
  async () => {
    const offset = 300;

    await page.goto(`http://localhost:1338/?integration=true`);
    await page.evaluate(
      (left: number) =>
        TestEntry.Tests.viewportHere({ top: 0, right: 0, bottom: 0, left }),
      offset
    );

    const screenshot = await page.screenshot({
      path: './screenshots/viewport-here.png'
    });
    const parsed = await Util.parsePng(screenshot);
    expect(parsed.getPixel(parsed.width / 2, parsed.height / 2)).not.toEqual([
      255,
      0,
      0,
      255
    ]);
    expect(
      parsed.getPixel(parsed.width / 2 - offset / 2, parsed.height / 2)
    ).toEqual([255, 0, 0, 255]);
  },
  TIMEOUT
);

test(
  'Traffic Layer with HERE changes display',
  async () => {
    await page.goto(`http://localhost:1338/?integration=true`);

    await page.evaluate(
      (layer: Types.GeoLayer) => TestEntry.Tests.layerHere(layer),
      Types.GeoLayer.None
    );
    const before = await page.screenshot({
      path: './screenshots/layer-traffic-here-before.png'
    });

    await page.evaluate(
      (layer: Types.GeoLayer) => TestEntry.Tests.layerHere(layer),
      Types.GeoLayer.Traffic
    );
    const after = await page.screenshot({
      path: './screenshots/layer-traffic-here-after.png'
    });

    expect(before).not.toEqual(after);
  },
  TIMEOUT
);

test(
  'Click events with HERE trigger call on event handler',
  async () => {
    await page.goto(`http://localhost:1338/?integration=true`);
    await page.evaluate(() => TestEntry.Tests.eventHere('click-id'));
    await page.click('[data-map="Here"]');
    await page.waitForSelector('[data-dump="data-dump"]');
    const data = JSON.parse(
      String(
        await page.evaluate(
          () => document.querySelector('[data-dump="data-dump"]').textContent
        )
      )
    );
    expect(data.clicked).toBe(1);
  },
  TIMEOUT
);

test(
  'Click events with HERE carry appropriate lat/lng data',
  async () => {
    const center = { lat: 7.5, lng: 10 };

    await page.goto(`http://localhost:1338/?integration=true`);
    await page.evaluate(
      input => TestEntry.Tests.eventPayloadHere(input),
      center
    );
    await page.mouse.click(400, 300); // click on center
    await page.waitForSelector('[data-dump="data-dump"]');
    const { position } = JSON.parse(
      String(
        await page.evaluate(
          () => document.querySelector('[data-dump="data-dump"]').textContent
        )
      )
    );

    expect(position.lat).toBeCloseTo(center.lat);
    expect(position.lng).toBeCloseTo(center.lng);
  },
  TIMEOUT
);

test(
  'Geocoding works as expected',
  async () => {
    await page.goto(`http://localhost:1338/?integration=true`);
    await page.evaluate(
      input => TestEntry.Tests.geocodeHere(input),
      TestEntry.Constants.S2_BER
    );
    await page.mouse.click(400, 300); // click on center
    await page.waitForSelector('[data-dump="data-dump"]');

    const data = JSON.parse(
      String(
        await page.evaluate(
          () => document.querySelector('[data-dump="data-dump"]').textContent
        )
      )
    );

    expect(data).toEqual(
      expect.objectContaining({
        provider: Types.GeoMapProvider.Here,
        formattedAddress: 'Boxhagener Straße 75, 10245 Berlin, Deutschland',
        address: expect.objectContaining({
          country: 'DEU',
          postalCode: '10245',
          locality: 'Berlin',
          route: 'Boxhagener Straße',
          streetNumber: '75'
        })
      })
    );
  },
  TIMEOUT
);

test(
  'Search works as expected',
  async () => {
    await page.goto(`http://localhost:1338/?integration=true`);
    await page.evaluate(() => TestEntry.Tests.searchHere('SinnerSchrader'));

    await page.waitForSelector('[data-dump="data-dump"]');
    const data = JSON.parse(
      String(
        await page.evaluate(
          () => document.querySelector('[data-dump="data-dump"]').textContent
        )
      )
    );

    expect(data).toContainEqual(
      expect.objectContaining({
        name: expect.stringContaining('Sinnerschrader')
      })
    );
  },
  TIMEOUT
);

test(
  'getPlace with all details',
  async () => {
    await page.goto(`http://localhost:1338/?integration=true`);
    await page.evaluate(() =>
      TestEntry.Tests.getAllWayDownFromReverseGeocode()
    );

    await page.waitForSelector('[data-dump="data-dump"]');

    const data = JSON.parse(
      String(
        await page.evaluate(
          () => document.querySelector('[data-dump="data-dump"]').textContent
        )
      )
    );

    expect(data).toEqual(
      expect.objectContaining({
        name: expect.stringContaining('Sinnerschrader')
      })
    );
  },
  TIMEOUT
);

test(
  'paint route on here map',
  async () => {
    await page.goto(`http://localhost:1338/?integration=true`);
    await page.evaluate(() => TestEntry.Tests.paintHereRoute());
    await page.waitForSelector('[data-dump="data-dump"]');

    const data: Types.GeoMapDirectionResult = JSON.parse(
      String(
        await page.evaluate(
          () => document.querySelector('[data-dump="data-dump"]').textContent
        )
      )
    );

    expect(data.start.lat).toBeCloseTo(TestEntry.Constants.S2_HAM.lat);
    expect(data.start.lng).toBeCloseTo(TestEntry.Constants.S2_HAM.lng);
    expect(data.end.lat).toBeCloseTo(TestEntry.Constants.S2_BER.lat);
    expect(data.end.lng).toBeCloseTo(TestEntry.Constants.S2_BER.lng);
  },
  TIMEOUT
);

describe.only('markers', () => {
  test(
    'Geo createMarker triggers change event with HERE',
    async () => {
      await page.goto(`http://localhost:1338/?integration=true`);
      await page.evaluate(() => TestEntry.Tests.hereCreateMarkerFiresChange());
      await page.waitForSelector('[data-dump="data-dump"]');

      const data: Types.GeoMapDirectionResult = JSON.parse(
        String(
          await page.evaluate(
            () => document.querySelector('[data-dump="data-dump"]').textContent
          )
        )
      );
      expect(data).toBeCloseTo(TestEntry.Constants.S2_HAM.lat);
    },
    TIMEOUT
  );

  test(
    'GeoMarker.remove triggers change event with HERE',
    async () => {
      await page.goto(`http://localhost:1338/?integration=true`);
      await page.evaluate(() => TestEntry.Tests.hereRemoveMarkerFiresChange());
      await page.waitForSelector('[data-dump="data-dump"]');

      const data: Types.GeoMapDirectionResult = JSON.parse(
        String(
          await page.evaluate(
            () => document.querySelector('[data-dump="data-dump"]').textContent
          )
        )
      );
      expect(data).toBeCloseTo(TestEntry.Constants.S2_HAM.lat);
    },
    TIMEOUT
  );
});
