import {Component} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {Observable} from 'rxjs/Observable';

import {FantasyTeam} from '../fantasy-team';
import {FantasyTeamService} from '../fantasy-team.service';
import {FantasyTeamCard} from '../card/fantasy-team-card.component';

import {Spinner} from '../../spinner/spinner.component';

@Component({
  selector: 'fantasy-teams-page',
  template: require('./fantasy-teams-page.component.html'),
  styles: [require('./fantasy-teams-page.component.scss')],
  directives: [
    FantasyTeamCard,
    RouterLink,
    Spinner
  ]
})
export class FantasyTeamsPage {

  fantasyTeams: FantasyTeam[] = [];
  loading: boolean = true;

  constructor(
    private _fantasyTeamService: FantasyTeamService) { }

  ngOnInit() {
    this._fantasyTeamService.getTeams().subscribe((teams) => {
      this.fantasyTeams = teams;
      this.loading = false;

      Promise.all(teams.map(team => team.isDoneLoading())).then(() => {
        this.fantasyTeams = this.fantasyTeams.sort((a, b) => {
          if (a.points === b.points) { return 0; }
          return a.points < b.points ? 1 : -1;
        });
      });
    });
  }

}
