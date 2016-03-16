import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromArray';

import {DRAFT_NAME} from '../../config';
import {Game} from '../games/game';
import {GameService} from '../games/game.service';

export interface SchoolOptions {
  name: string;
  id: string;
  seed: number;
  wins: number;
  ep: number;
  region: string;
  gameIds: Array<string>;
};

export class School  {
  name: string;
  id: string;
  seed: number;
  wins: number;
  ep: number;
  region: string;
  games: Array<Game>;
  draftTeam: string;

  get points(): number { return this.seed * this.wins; }

  get drafted(): boolean { return this.draftTeam !== null; }

  constructor();
  constructor(obj: SchoolOptions, gameService: GameService);
  constructor(obj?: any, gameService?: any) {
    this.name = obj && obj.name || null;
    this.id   = obj && obj.id   || null;
    this.seed = obj && obj.seed || null;
    this.wins = obj && obj.wins || 0;
    this.ep   = obj && obj.ep   || 0;
    this.region = obj && obj.region || null;
    this.draftTeam = obj && obj[DRAFT_NAME] || null;
    this.games = obj && obj.games || [];
    if (gameService) {
      this._loadGames(obj && obj.gameIds || [], gameService);
    }
  }

  _loadGames(gameIds: {}, gameService: GameService) {
    this.games = [];
    for (let gameId in gameIds) {
      if (gameIds.hasOwnProperty(gameId)) {
        gameService.getGame(gameId).subscribe((game: Game) => {
          this.games.push(game);
        });
      }
    }
  }
}
