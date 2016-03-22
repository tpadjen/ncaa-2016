import {
  Injectable,
  Inject,
  forwardRef,
  Optional
} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {FirebaseData, extend} from '../firebase/ng-firebase';
import {Game} from '../games/game';
import {GameService} from '../games/game.service';


@Injectable()
export class School  {
  name: string;
  id: string;
  seed: number;
  wins: number = 0;
  ep: number = 0;
  region: string;
  games: Array<Game> = [];
  pick: {
    id: string;
    n: number;
    team: any;
  };
  draftTeam: string;
  eliminated: boolean = false;

  _gameService;
  constructor(
    data: FirebaseData,
    @Optional() @Inject(forwardRef(() => GameService)) _gameService: GameService
  ) {
    this._gameService = _gameService;
    extend(this, data);
    if (_gameService) {
      this._loadGames(data['gameIds'] || {});
    }
  }

  get points(): number {
    let score = 0;
    for (let i = 1; i <= this.wins; i++) {
      score += this.seed * i;
    }
    return score;
  }

  get drafted(): boolean { return this.draftTeam !== null; }

  _loadGames(gameIds: {}) {
    this.games = [];
    for (let gameId in gameIds) {
      if (gameIds.hasOwnProperty(gameId)) {
        this._gameService.getGame(gameId).subscribe((game: Game) => {
          this.games.push(game);
        });
      }
    }
  }
}
