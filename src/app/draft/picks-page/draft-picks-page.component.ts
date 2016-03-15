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

  draftPicks: DraftPick[];

  constructor(
    private _draftService: DraftService) { }

  ngOnInit() {
    this._draftService.getDraftPicks().subscribe((picks) => {
      this.draftPicks = picks;
    });
  }

  undraftLast() {
    this._draftService.undraft(this.draftPicks[this.draftPicks.length - 1]);
  }
}
