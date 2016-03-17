import {Observable} from 'rxjs/Observable';
import {Component, Input, OnChanges} from 'angular2/core';
import {Game} from '../../../games/game';
import {School} from '../../../schools/school';
import {FantasyTeam} from '../../fantasy-team';
import {FantasyTeamService} from '../../fantasy-team.service';

@Component({
  selector: 'games-table',
  template: require('./games-table.component.html'),
  styles: [require('./games-table.component.scss')]
})
export class GamesTable {

  games: Observable<Game[]>;
  _fantasyTeam;
  @Input() set fantasyTeam(team: FantasyTeam) {
    this._fantasyTeam = team;
    this.games = this._fantasyTeamService.getGamesForTeam(team);
  }
  get fantasyTeam(): FantasyTeam {
    return this._fantasyTeam;
  }

  constructor(private _fantasyTeamService: FantasyTeamService) { }


}
