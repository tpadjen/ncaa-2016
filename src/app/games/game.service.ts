import {
  Injectable
} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {observableFirebaseObject} from '../firebase/observableFirebase';
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


}
