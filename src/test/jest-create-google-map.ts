import { GeoMapHere } from '../geo-map-here';
import * as Test from './index';
import * as Types from '../types';
import { GeoMapGoogle } from '../geo-map-google';

export declare type GoogleMapImplation = Types.TestMapImplementation<
  GeoMapGoogle
>;
export interface GoogleMapImplationDonot {
  googleMap: GoogleMapImplation;
}

export function jestCreateGoogleMapImpl(
  cb: (mapImpl: GoogleMapImplationDonot) => Promise<void>
) {
  const googleMapReady = Test.future<GoogleMapImplation>();
  const waitForAfterAll = Test.future();

  const donot: GoogleMapImplationDonot = { googleMap: undefined };

  Test.browserCtxify<Types.LoadGoogleMapConfig>(async browserCtx => {
    // console.log('b=1');
    googleMapReady.resolve(
      await Test.createGoogleMapImplementation({
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
    donot.googleMap = await googleMapReady.promise;
  });

  cb(donot);

  afterAll(async () => {
    // console.log('huhu=8');
    waitForAfterAll.resolve();
  });
}
