// playlist.store.ts
import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface PlaylistState {
  isNew: boolean;
}

export function createInitialState(): PlaylistState {
  return {
    isNew: false
  };
}

@StoreConfig({ name: 'playlist' })
@Injectable({ providedIn: 'root' })
export class PlaylistStore extends Store<PlaylistState> {
  constructor() {
    super(createInitialState());
  }
}
