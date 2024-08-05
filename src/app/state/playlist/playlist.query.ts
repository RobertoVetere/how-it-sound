// playlist.query.ts
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { PlaylistState, PlaylistStore } from './playlist.store';

@Injectable({ providedIn: 'root' })
export class PlaylistQuery extends Query<PlaylistState> {
  isNew$ = this.select(state => state.isNew);

  constructor(protected override store: PlaylistStore) {
    super(store);
  }
}
