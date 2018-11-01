export enum AddressComponentVariant {
  Long,
  Short
}

export function getAddressComponent(
  components: google.maps.GeocoderAddressComponent[]
): (
  tag: string,
  options?: { variant: AddressComponentVariant }
) => string | undefined {
  return (tag, options = { variant: AddressComponentVariant.Long }) => {
    const component = components.find(c => c.types.indexOf(tag) > -1);

    if (!component) {
      return;
    }

    switch (options.variant) {
      case AddressComponentVariant.Short:
        return component.short_name;
      case AddressComponentVariant.Long:
      default:
        return component.long_name;
    }
  };
}
