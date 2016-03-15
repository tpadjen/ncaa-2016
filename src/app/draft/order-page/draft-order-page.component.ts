import {
  Component,
  Output,
  EventEmitter
} from 'angular2/core';
import {Observable} from 'rxjs/Observable';

import {DraftPick} from '../draft-pick';
import {DraftService} from '../draft.service';

import {FantasyTeam} from '../../fantasyTeams/fantasy-team';
import {FantasyTeamService} from '../../fantasyTeams/fantasy-team.service';

import {SortableList} from './sortable-list/sortable-list.component';

@Component({
  selector: 'draft-order-page',
  template: require('./draft-order-page.component.html'),
  directives: [SortableList]
})
export class DraftOrderPage {

  order: FantasyTeam[];

  constructor(
    private _draftService: DraftService,
    private _fantasyTeamService: FantasyTeamService) { }

  ngOnInit() {
    this._draftService.getDraftOrder()
      .subscribe((order: FantasyTeam[]) => this.order = order);
  }

  updateDraftOrder(list) {
    list = list.map(team => team.id);
    this._draftService.updateDraftOrder(list);
  }

  updateTeam(info) {
    // update local copy
    for (let team of this.order) {
      if (team.id === info.id) {
        team.name = info.name;
      }
    }

    // update firebase
    this._fantasyTeamService.updateTeam(info.name, info.id);
  }

}
