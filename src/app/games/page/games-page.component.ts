import {
  Component,
  Output,
  EventEmitter
} from 'angular2/core';
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

  constructor(private _gameService: GameService) { }

  ngOnInit() {
    this._gameService.getGames().subscribe((games) => {
      this.games = games;
    });
  }

}
