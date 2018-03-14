import {
  Component,
  Output,
  EventEmitter
} from 'angular2/core';
import {isPresent} from 'angular2/src/facade/lang';
import {Observable} from 'rxjs/Observable';

import {Game} from '../game';
import {GameService} from '../game.service';

@Component({
  selector: 'games-page',
  template: require('./games-page.component.html'),
  styles: [require('./games-page.component.scss')]
})
export class GamesPage {

  games: Game[];
  rounds: any[] = [];

  constructor(private _gameService: GameService) { }

  ngOnInit() {
    this._gameService.getGames().subscribe((games) => {
      if (games.length > 63 && games[0].id !== "0") {
        games.shift();
      }
      this.games = games;

      this.rounds = [];
      [1, 2, 3, 4, 5, 6].forEach((round) => {
        this.rounds[round-1] = this.games.filter(game => {
          return game.round === round &&
                  isPresent(game.schools) &&
                  isPresent(game.schools[0]) &&
                  isPresent(game.schools[1]);
        });
      });
    });
  }

  win(game: Game, index: number, winner: any) {
    if (winner) return; // game already has a winner, needs to be undone to change
    this._gameService.win(game, index);
  }

  undoWin(game: Game) {
    this._gameService.undoWin(game);
  }

}
