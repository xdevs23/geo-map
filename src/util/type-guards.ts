import * as Types from '../types';

export function isGeoBounds(value: {}): value is Types.GeoBounds {
  const geoBounds = value as Partial<Types.GeoBounds>;

  return (
    typeof geoBounds.east === 'number' &&
    typeof geoBounds.north === 'number' &&
    typeof geoBounds.south === 'number' &&
    typeof geoBounds.west === 'number'
  );
}

export function isGeoPoint(value: {}): value is Types.GeoPoint {
  const geoPoint = value as Partial<Types.GeoPoint>;

  return typeof geoPoint.lat === 'number' && typeof geoPoint.lng === 'number';
}
