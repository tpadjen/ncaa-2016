import {
  Injectable,
  Inject,
  forwardRef
} from 'angular2/core';
import {isPresent} from 'angular2/src/facade/lang';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Ng2Firebase, FirebaseData} from 'ng2-firebase-observables/ng2-firebase-observables';
import {Game} from './game';
import {FantasyTeam} from '../fantasyTeams/fantasy-team';
import {FantasyTeamService} from '../fantasyTeams/fantasy-team.service';
import {School} from '../schools/school';
import {SchoolService} from '../schools/school.service';
import {
  DRAFT_NAME,
  DRAFT_URL
} from '../../config';


@Injectable()
export class GameService {

  gamesRef = new Firebase(DRAFT_URL).child('games').child(DRAFT_NAME);
  games$: BehaviorSubject<Game[]>;

  constructor(
    @Inject(forwardRef(() => FantasyTeamService)) private _fantasyTeamService: FantasyTeamService,
    @Inject(forwardRef(() => SchoolService)) private _schoolService: SchoolService
  ) {
    this.games$ = Ng2Firebase.array(this.gamesRef, Game);
    this.games$.subscribe();
  }

  getGame(id: string): Observable<Game> {
    return Ng2Firebase.object(this.gamesRef.child(id), Game);
  }

  getGames(): Observable<Game[]> {
    return this.games$;
  }

  getGamesForFantasyTeam(team: FantasyTeam): Observable<any[]> {
    return Observable.create((observer) => {
      this.games$.subscribe((games) => {
        let teamGames = [];
        games.forEach((game) => {
          if (game.schools) {
            if (isPresent(game.schools[0]) && team.hasSchool(game.schools[0].id)) {
              teamGames.push(game);
            }
            if (isPresent(game.schools[1]) && team.hasSchool(game.schools[1].id)) {
              teamGames.push(game);
            }
          }
        });
        observer.next(teamGames);
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
        this._saveNextGame(game, winner).then((next: {id: string}) => {
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
    return this.gamesRef.child(game.id.toString()).child('winner').set(winner && winner.id || null);
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
        this.gamesRef.child(game.next.toString()).child('schools').set(schools, () => {
          resolve(next);
        });
      });
    });
  }

  _getNextGame(game: Game): Promise<any> {
    return new Promise((resolve) => {
      this.gamesRef.child(game.next.toString()).once('value', (snap) => {
        resolve(snap.val());
      });
    });
  }

  _addGameId(next: {id: string}, winner: {id: string}): Promise<any> {
    return this._schoolService.addGameId(next.id, winner.id);
  }

  _removeGameId(next: any, winner: any): Promise<any> {
    return this._schoolService.removeGameId(next.id, winner);
  }

  _updateSchoolWins(winnerId: string, updateAmount: number): Promise<any> {
    return this._schoolService.updateWins(winnerId, updateAmount);
  }

  _setEliminated(loser: any, value: boolean): Promise<any> {
    return this._schoolService.setEliminated(loser.id, value);
  }

  _updateFantasyTeamWins(winnerId: string, updateAmount: number): Promise<any> {
    return new Promise((resolve) => {
      this._schoolService.getPickedTeam(winnerId).then(team => {
        this._fantasyTeamService.updateWins(team, updateAmount).then(() => {
          resolve();
        });
      });
    });
  }

}
