import { Resolvable } from './resolvable';
import { GeoMapPhase as G } from './types';

export class GeoMapPhases {
  private readonly phases: { [id: string]: Resolvable<void> } = {
    [G.Pristine]: new Resolvable<void>(),
    [G.Loading]: new Resolvable<void>(),
    [G.Loaded]: new Resolvable<void>(),
    [G.Mounting]: new Resolvable<void>(),
    [G.Mounted]: new Resolvable<void>(),
    [G.Layouting]: new Resolvable<void>(),
    [G.Layouted]: new Resolvable<void>()
  };

  public get(phase: G): Resolvable<void> {
    return this.phases[phase];
  }

  public resolve(phase: G): void {
    this.phases[phase].resolve(undefined);
  }
}
