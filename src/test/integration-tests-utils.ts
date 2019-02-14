import * as Constants from './constants';
import { BrowserCtx, GeoMapConfig } from '../types';
import { createBrowserCtx } from '../util';
import { GeoMap } from '../geo-map';

export const VIEWPORT = { top: 0, right: 0, bottom: 0, left: 300 };

export const BOUNDS = {
  north: Constants.S2_HAM.lat,
  east: Constants.S2_HAM.lng,
  south: 0,
  west: 0
};

export interface InjectBrowserCtx {
  <R>(fn: (b: BrowserCtx<GeoMapConfig>) => Promise<R>): () => Promise<R>;
  <A1, A2, A3, A4, R>(
    fn: (
      b: BrowserCtx<GeoMapConfig>,
      a1: A1,
      a2: A2,
      a3: A3,
      a4: A4
    ) => Promise<R>
  ): (a1: A1, a2: A2, a3: A3, a4: A4) => Promise<R>;
  <A1, A2, A3, R>(
    fn: (b: BrowserCtx<GeoMapConfig>, a1: A1, a2: A2, a3: A3) => Promise<R>
  ): (a1: A1, a2: A2, a3: A3) => Promise<R>;
  <A1, A2, R>(
    fn: (b: BrowserCtx<GeoMapConfig>, a1: A1, a2: A2) => Promise<R>
  ): (a1: A1, a2: A2) => Promise<R>;
  <A1, R>(fn: (b: BrowserCtx<GeoMapConfig>, a1: A1) => Promise<R>): (
    a1: A1
  ) => Promise<R>;
}

/*
export function injectBrowserCtx<A1, A2, A3, A4>(
  fn: (
    b: BrowserCtx<GeoMapConfig>,
    a1: A1,
    a2: A2,
    a3: A3,
    a4: A4
  ) => Promise<GeoMap>
): (a1: A1, a2: A2, a3: A3, a4: A4) => Promise<GeoMap>;
export function injectBrowserCtx<A1, A2, A3>(
  fn: (b: BrowserCtx<GeoMapConfig>, a1: A1, a2: A2, a3: A3) => Promise<GeoMap>
): (a1: A1, a2: A2, a3: A3) => Promise<GeoMap>;
export function injectBrowserCtx<A1, A2>(
  fn: (b: BrowserCtx<GeoMapConfig>, a1: A1, a2: A2) => Promise<GeoMap>
): (a1: A1, a2: A2) => Promise<GeoMap>;
export function injectBrowserCtx<A1>(
  fn: (b: BrowserCtx<GeoMapConfig>, a1: A1) => Promise<GeoMap>
): (a1: A1) => Promise<GeoMap>;
export function injectBrowserCtx(
  fn: (b: BrowserCtx<GeoMapConfig>) => Promise<GeoMap>
): () => Promise<GeoMap>;
*/
export const injectBrowserCtx: InjectBrowserCtx = (function(
  cb: (b: BrowserCtx<GeoMapConfig>, ...args: any[]) => Promise<unknown>
): () => Promise<unknown> {
  return function(...args: unknown[]): Promise<unknown> {
    return cb.apply(this, [createBrowserCtx(), ...args]) as Promise<unknown>;
  };
} as unknown) as InjectBrowserCtx;

/*
export function injectBrowserCtx1<A1, O = GeoMapConfig, R = A1>(fn: (b: BrowserCtx<O>, a1: A1) => Promise<R>): (a1: A1) => Promise<R> {
  return undefined;
}

export function injectBrowserCtx2<A1, A2, O = GeoMapConfig, R = A1>(fn: (b: BrowserCtx<O>, a1: A1, a2: A2) => Promise<R>): (a1: A1, a2: A2) => Promise<R> {
  return undefined;
}
*/
