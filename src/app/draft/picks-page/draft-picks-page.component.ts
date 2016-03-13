import {
  Component,
  Output,
  EventEmitter
} from 'angular2/core';
import {Observable} from 'rxjs/Observable';

import {DraftPick} from '../draft-pick';
import {DraftService} from '../draft.service';

@Component({
  selector: 'draft-picks-page',
  template: require('./draft-picks-page.component.html')
})
export class DraftPicksPage {

  draftPicks: Observable<DraftPick[]>;

  constructor(
    private _draftService: DraftService) { }

  ngOnInit() {
    this.draftPicks = this._draftService.getDraftPicks();
  }

  undraft(pick: DraftPick) {
    this._draftService.undraft(pick);
  }
}
