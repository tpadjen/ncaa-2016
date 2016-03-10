import {Component} from 'angular2/core';
import {Observable} from 'rxjs/Observable';

import {DraftPick} from '../draft-pick';
import {DraftService} from '../draft.service';

@Component({
  selector: 'draft-tab',
  template: require('./draft-tab.component.html')
})
export class DraftTab {

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
