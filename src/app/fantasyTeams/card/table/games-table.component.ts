import {Observable} from 'rxjs/Observable';
import {Component, Input} from 'angular2/core';
import {Game} from '../../../games/game';
import {School} from '../../../schools/school';
import {FantasyTeam} from '../../fantasy-team';
import {FantasyTeamService} from '../../fantasy-team.service';
import {Spinner} from '../../../spinner/spinner.component';

@Component({
  selector: 'games-table',
  template: require('./games-table.component.html'),
  styles: [require('./games-table.component.scss')],
  directives: [Spinner]
})
export class GamesTable {

  games: Game[];
  rounds: any[] = [];
  loaded: boolean = false;
  _fantasyTeam;

  @Input() set fantasyTeam(team: FantasyTeam) {
    this._fantasyTeam = team;
    this.games = this._fantasyTeamService.getGamesForTeam(team).subscribe((games) => {
      this.games = games;
      this.rounds = [];
      [1, 2, 3, 4, 5, 6].forEach((round) => {
        this.rounds[round-1] = this.games.filter(game => game.round === round);
      });
      this.rounds.reverse();
      this.loaded = true;
    });
  }
  get fantasyTeam(): FantasyTeam {
    return this._fantasyTeam;
  }

  constructor(private _fantasyTeamService: FantasyTeamService) { }

  winner(game: Game) {
    return game.winner && this.fantasyTeam.hasSchool(game.winner);
  }

  loser(game: Game) {
    return game.winner && !this.fantasyTeam.hasSchool(game.winner);
  }

  ownerOf(schoolId: string) {
    return this.fantasyTeam.hasSchool(schoolId);
  }


}
