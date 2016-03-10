import {Component} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {Observable} from 'rxjs/Observable';

import {FantasyTeam} from './fantasyTeams/fantasy-team';
import {DraftService} from './draft/draft.service';

import {FantasyTeamsTab} from './fantasyTeams/tab/fantasy-teams-tab.component';
import {SchoolsTab} from './schools/tab/schools-tab.component';
import {DraftTab} from './draft/tab/draft-tab.component';

@Component({
  selector: 'app',
  template: require('./app.html'),
  styles: [require('./app.scss')],
  directives: [
    MATERIAL_DIRECTIVES,
    FantasyTeamsTab,
    SchoolsTab,
    DraftTab
  ]
})
export class App {

  currentTeam: FantasyTeam;
  updatingTeam: boolean = false;

  constructor(
    private _draftService: DraftService) { }

  ngOnInit() {
    this._draftService.currentTeam.subscribe((team) => {
      this.currentTeam = team;
      this.updatingTeam = false;
    });
  }

  updating() {
    this.updatingTeam = true;
  }

}
