import {
  Injectable
} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {
  observableFirebaseObject,
  observableFirebaseArray
} from '../firebase/observableFirebase';
import {Game, GameOptions} from './game';
import {FantasyTeam} from '../fantasyTeams/fantasy-team';
import {School} from '../schools/school';
import {DRAFT_NAME} from '../../config';


@Injectable()
export class GameService {

  draftURL = 'https://mvhs-ncaa-2016.firebaseio.com/';
  teams = new Firebase(this.draftURL).child('teams').child(DRAFT_NAME);
  games = new Firebase(this.draftURL).child('games').child(DRAFT_NAME);
  schools = new Firebase(this.draftURL).child('schools').child(DRAFT_NAME);

  constructor() { }

  getSchoolForGame(school: School) {
    return Observable.create((observer) => {
      this.schools.child(school.id).once('value', (snap) => {
        observer.next(new School(snap.val(), null));
      });
    });
  }

  getGame(id: string): Observable<Game> {
    return observableFirebaseObject(this.games.child(id), 'id')
            .map((gameOptions: GameOptions) => { return new Game(gameOptions, this); });
  }

  getGames(): any {
    return Observable.create((observer) => {
      this.games.on('value', (snap) => {
        let games = snap.val();
        observer.next(games.map((g: GameOptions) => {
          return new Game(g, this);
        }));
      });
    });
  }

  getGamesForFantasyTeam(team: FantasyTeam): Observable<any[]> {
    return Observable.create((observer) => {
      this.teams.child(team.id).child('gameIds').on('value', (snapshot) => {
        let gameIds = snapshot.val();
        let games = [];
        for (let gId of gameIds) {
          this.games.child(gId).once('value', (snap) => {
            games.push(new Game(snap.val(), this));
            observer.next(games);
          });
        }
      });
    });
  }

  win(game: Game, index): Promise<any> {
    return new Promise((resolve) => {
      let tasks = [];
      let winner = game.schools[index];
      let loser = game.schools[index === 0 ? 1 : 0];

      tasks.push(this._setWinnerId(game, winner));
      tasks.push(new Promise((r) => {
        this._saveNextGame(game, winner).then((next) => {
          this._addGameId(next, winner).then(() => r());
        });
      }));
      tasks.push(this._updateSchoolWins(winner.id, 1));
      tasks.push(this._setEliminated(loser, true));
      tasks.push(this._updateFantasyTeamWins(winner.id, 1));

      Promise.all(tasks).then(() => resolve());
    });
  }

  undoWin(game: Game): Promise<any> {
    return new Promise((resolve) => {
      let tasks = [];

      tasks.push(this._setWinnerId(game, null));
      tasks.push(new Promise((r) => {
        this._saveNextGame(game, null).then((next) => {
          this._removeGameId(next, game.winner).then(() => r());
        });
      }));
      tasks.push(this._updateSchoolWins(game.winner, -1));
      let eliminated = 0;
      if (game.schools[0].id === game.winner) {
        eliminated = 1;
      }
      tasks.push(this._setEliminated(game.schools[eliminated], false));
      tasks.push(this._updateFantasyTeamWins(game.winner, -1));

      Promise.all(tasks).then(() => resolve());
    });

  }

  _setWinnerId(game: Game, winner: any): Promise<any> {
    return this.games.child(game.id.toString()).child('winner').set(winner && winner.id || null);
  }

  _saveNextGame(game: Game, winner: any) {
    return new Promise((resolve) => {
      this._getNextGame(game).then((next) => {
        let schools = next.schools || [];
        let nextSpot = 0;
        if (next.prev1 === game.id) {
          nextSpot = 1;
        }
        schools[nextSpot] = winner;

        // save next game
        this.games.child(game.next.toString()).child('schools').set(schools, () => {
          resolve(next);
        });
      });
    });
  }

  _getNextGame(game: Game): Promise<any> {
    return new Promise((resolve) => {
      this.games.child(game.next.toString()).once('value', (snap) => {
        resolve(snap.val());
      });
    });
  }

  _addGameId(next: any, winner: any): Promise<any> {
    return this.schools
                .child(winner.id)
                .child('gameIds')
                .child(next.id.toString())
                .set(true);
  }

  _removeGameId(next: any, winner: any): Promise<any> {
    return this.schools
                .child(winner)
                .child('gameIds')
                .child(next.id)
                .remove();
  }

  _updateSchoolWins(winnerId: string, amount: number): Promise<any> {
    return new Promise((resolve) => {
      this.schools
          .child(winnerId)
          .child('wins')
          .transaction((wins) => {
            return (wins || 0) + amount;
          }, () => resolve());
    });
  }

  _setEliminated(loser: any, value: boolean): Promise<any> {
    return this.schools
                .child(loser.id)
                .child('eliminated').set(value);
  }

  _updateFantasyTeamWins(winnerId: string, updateAmount: number): Promise<any> {
    return new Promise((resolve) => {
      // get winning school's fantasy team
      this.schools
            .child(winnerId)
            .child('pick')
            .child('team')
            .child('id')
            .once('value', (snapshot) => {
              // increase # of wins so team updates
              this.teams
                    .child(snapshot.val())
                    .child('wins')
                    .transaction((wins) => {
                      return (wins || 0) + updateAmount;
                    }, () => {
                      resolve();
                    });
            });
    });
  }

}
