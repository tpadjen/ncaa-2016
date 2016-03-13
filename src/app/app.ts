import {Component} from 'angular2/core';
import {
  RouteConfig,
  RouterLink,
  RouterOutlet
} from 'angular2/router';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {Observable} from 'rxjs/Observable';

import {FantasyTeam} from './fantasyTeams/fantasy-team';
import {DraftService} from './draft/draft.service';

import {FantasyTeamsTab} from './fantasyTeams/tab/fantasy-teams-tab.component';
import {SchoolsTab} from './schools/tab/schools-tab.component';
import {DraftPicksTab} from './draft/picks-tab/draft-picks-tab.component';
import {DraftOrderTab} from './draft/order-tab/draft-order-tab.component';

@Component({
  selector: 'app',
  template: require('./app.html'),
  styles: [require('./app.scss')],
  directives: [
    RouterLink,
    RouterOutlet,
    MATERIAL_DIRECTIVES,
    FantasyTeamsTab,
    SchoolsTab,
    DraftPicksTab,
    DraftOrderTab
  ]
})
@RouteConfig([
  { path: '/', name: 'Scores', component: FantasyTeamsTab, useAsDefault: true },
  { path: '/schools', name: 'Schools', component: SchoolsTab },
  { path: '/picks', name: 'DraftPicks', component: DraftPicksTab },
  { path: '/order', name: 'DraftOrder', component: DraftOrderTab }
])
export class App {

  currentTeam: FantasyTeam;
  updatingTeam: Observable<boolean>;

  constructor(
    private _draftService: DraftService) { }

  ngOnInit() {
    this.updatingTeam = this._draftService.updating;
    this._draftService.currentTeam.subscribe((team) => {
      this.currentTeam = team;
    });
  }

}
