import {Component} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

import {Observable} from 'rxjs/Observable';

import {FantasyTeam} from './fantasyTeams/fantasy-team';
import {FantasyTeamService} from './fantasyTeams/fantasy-team.service';
import {FantasyTeamCard} from './fantasyTeams/card/fantasy-team-card.component';

import {DraftPick} from './draft/draft-pick';
import {DraftService} from './draft/draft.service';

import {School} from './schools/school';
import {SchoolsTab} from './schools/tab/schools-tab.component';

@Component({
  selector: 'app',
  template: require('./app.html'),
  styles: [require('./app.scss')],
  directives: [MATERIAL_DIRECTIVES, FantasyTeamCard, SchoolsTab]
})
export class App {

  fantasyTeams: Observable<FantasyTeam[]>;
  draftPicks: Observable<DraftPick[]>;
  currentTeam: FantasyTeam;

  constructor(
    private _fantasyTeamService: FantasyTeamService,
    private _draftService: DraftService) { }

  ngOnInit() {
    this.fantasyTeams = this._fantasyTeamService.getTeams();
    this.draftPicks = this._draftService.getDraftPicks();
    this._draftService.currentTeam.subscribe((team) => {
      this.currentTeam = team;
    });
  }

  undraft(pick: DraftPick) {
    this._draftService.undraft(pick);
  }

}
