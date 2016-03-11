import {
  Component,
  Output,
  EventEmitter
} from 'angular2/core';
import {Observable} from 'rxjs/Observable';

import {DraftPick} from '../draft-pick';
import {DraftService} from '../draft.service';

import {SortableList} from './sortable-list/sortable-list.component';

@Component({
  selector: 'draft-order-tab',
  template: require('./draft-order-tab.component.html'),
  directives: [SortableList]
})
export class DraftOrderTab {

  order: string[];

  constructor(
    private _draftService: DraftService) { }

  ngOnInit() {
    this._draftService.getDraftOrder()
      .subscribe((order: string[]) => this.order = order);
  }

  updateDraftOrder(list) {
    this._draftService.updateDraftOrder(list);
  }

}
