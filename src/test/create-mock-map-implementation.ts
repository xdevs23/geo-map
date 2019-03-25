import { createWindow } from './create-window';
import * as Constants from './constants';
import { ensureElement } from './ensure-element';
import * as Types from '../types';

// tslint:disable-next-line:no-any
const createGeoMock = (mixin?: any) => {
  return (jest.fn().mockImplementation(() => {
    return {
      async load(): Promise<void> {
        return;
      },
      async mount(): Promise<void> {
        return;
      },
      ...(mixin || {})
    };
    // tslint:disable-next-line:no-any
  }) as any) as () => Types.GeoMapImplementation;
};

// tslint:disable-next-line:no-any
export async function createMockMapImplementation(
  mixin?: any
): Promise<Types.GeoMapImplementation> {
  const window = createWindow();
  const GeoMock = createGeoMock(mixin);
  const map = GeoMock();
  const el = ensureElement(Types.GeoMapProvider.Custom, { window });
  await map.load();
  await map.mount(el, { center: Constants.S2_HAM });
  return map;
}
