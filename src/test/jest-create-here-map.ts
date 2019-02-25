import { GeoMapHere } from '../geo-map-here';
import * as Test from './index';
import * as Types from '../types';

export declare type HereMapImplation = Types.TestMapImplementation<GeoMapHere>;
export interface HereMapImplationDonot {
  hereMap: HereMapImplation;
}

export function jestCreateHereMapImpl(
  cb: (mapImpl: HereMapImplationDonot) => Promise<void>
) {
  const hereMapReady = Test.future<HereMapImplation>();
  const waitForAfterAll = Test.future();

  const donot: HereMapImplationDonot = { hereMap: undefined };

  Test.browserCtxify<Types.LoadHereMapConfig>(async browserCtx => {
    // console.log('b=1');
    hereMapReady.resolve(
      await Test.createHereMapImplementation({
        config: browserCtx,
        mount: { zoom: 2, center: Test.Constants.S2_HAM }
      })
    );
    // console.log('b=2');
    await waitForAfterAll.promise;
    // console.log('b=3');
  })((() => {}) as jest.DoneCallback);

  beforeAll(async () => {
    // console.log('huhu=3');
    donot.hereMap = await hereMapReady.promise;
  });

  cb(donot);

  afterAll(async () => {
    // console.log('huhu=8');
    waitForAfterAll.resolve();
  });
}
