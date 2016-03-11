import {
  Component,
  Output,
  EventEmitter
} from 'angular2/core';
import {Observable} from 'rxjs/Observable';

import {DraftPick} from '../draft-pick';
import {DraftService} from '../draft.service';

@Component({
  selector: 'draft-picks-tab',
  template: require('./draft-picks-tab.component.html')
})
export class DraftPicksTab {

  @Output() updatingTeam: EventEmitter<boolean> = new EventEmitter<boolean>();

  draftPicks: Observable<DraftPick[]>;

  constructor(
    private _draftService: DraftService) { }

  ngOnInit() {
    this.draftPicks = this._draftService.getDraftPicks();
  }

  undraft(pick: DraftPick) {
    this.updatingTeam.next(true);
    this._draftService.undraft(pick);
  }
}
