import {Component} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {Observable} from 'rxjs/Observable';

import {FantasyTeam} from '../fantasy-team';
import {FantasyTeamService} from '../fantasy-team.service';
import {FantasyTeamCard} from '../card/fantasy-team-card.component';

@Component({
  selector: 'fantasy-teams-page',
  template: require('./fantasy-teams-page.component.html'),
  styles: [require('./fantasy-teams-page.component.scss')],
  directives: [
    FantasyTeamCard,
    RouterLink
  ]
})
export class FantasyTeamsPage {

  fantasyTeams: Observable<FantasyTeam[]>;

  constructor(
    private _fantasyTeamService: FantasyTeamService) { }

  ngOnInit() {
    this.fantasyTeams = this._fantasyTeamService.getTeams();
  }

}
