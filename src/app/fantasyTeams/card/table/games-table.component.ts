import {Observable} from 'rxjs/Observable';
import {Component, Input} from 'angular2/core';
import {Game} from '../../../games/game';
import {GameService} from '../../../games/game.service';
import {School} from '../../../schools/school';
import {FantasyTeam} from '../../fantasy-team';
import {Spinner} from '../../../spinner/spinner.component';

@Component({
  selector: 'games-table',
  template: require('./games-table.component.html'),
  styles: [require('./games-table.component.scss')],
  directives: [Spinner]
})
export class GamesTable {

  games: Game[] = [];
  rounds: any[] = [];
  loaded: boolean = false;
  _fantasyTeam;

  constructor(private _gameService: GameService) { }

  @Input() set fantasyTeam(team: FantasyTeam) {
    this._fantasyTeam = team;
    if (!team) return;

    this._gameService.getGamesForFantasyTeam(team).subscribe((games) => {
      this.games = this.uniqueGames(games);

      this.rounds = [];
      [1, 2, 3, 4, 5, 6].forEach((round) => {
        this.rounds[round-1] = this.games.filter(game => game.round === round);
      });
      this.rounds.reverse();
      this._fantasyTeam.isDoneLoading().then(() => {
        this.rounds.forEach((round) => {
          round.sort((a, b) => {
            return this._fantasyTeam.orderForGame(a) < this._fantasyTeam.orderForGame(b) ? -1 : 1;
          });
        });
        this.loaded = true;
      });
    });
  }
  get fantasyTeam(): FantasyTeam {
    return this._fantasyTeam;
  }


  winner(game: Game) {
    return game.winner && this.fantasyTeam.hasSchool(game.winner);
  }

  loser(game: Game) {
    return game.winner && !this.fantasyTeam.hasSchool(game.winner);
  }

  ownerOf(schoolId: string) {
    return this.fantasyTeam.hasSchool(schoolId);
  }

  getPointsForGame(game: Game, round: number): number {
    return this.getOwnedSchool(game).seed * (6 - round);
  }

  getOwnedSchool(game: Game): {id: string; name: string; seed: number} {
    return game.schools[0] &&
            this.fantasyTeam.hasSchool(game.schools[0].id) ? game.schools[0] : game.schools[1];
  }

  uniqueGames(rawGames: Game[]): Game[] {
    let seenIds = {};
    return rawGames.filter(function(game) {
      return seenIds.hasOwnProperty(game.id) ? false : (seenIds[game.id] = true);
    });
  }

}
