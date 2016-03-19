import {Component} from 'angular2/core';
import {Observable} from 'rxjs/Observable';

import {FantasyTeam} from '../fantasy-team';
import {FantasyTeamService} from '../fantasy-team.service';
import {FantasyTeamCard} from '../card/fantasy-team-card.component';

@Component({
  selector: 'all-teams-page',
  template: require('./all-teams-page.component.html'),
  directives: [
    FantasyTeamCard
  ]
})
export class AllTeamsPage {

  fantasyTeams: Observable<FantasyTeam[]>;

  constructor(
    private _fantasyTeamService: FantasyTeamService) { }

  ngOnInit() {
    this.fantasyTeams = this._fantasyTeamService.getTeams();
  }

}
