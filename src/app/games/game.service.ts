import {
  Injectable
} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {observableFirebaseObject} from '../firebase/observableFirebase';
import {Game} from './game';
import {FantasyTeam} from '../fantasyTeams/fantasy-team';
import {DRAFT_NAME} from '../../config';

@Injectable()
export class GameService {

  draftURL = 'https://mvhs-ncaa-2016.firebaseio.com/';
  teams = new Firebase(this.draftURL).child('teams').child(DRAFT_NAME);
  games = new Firebase(this.draftURL).child('games').child(DRAFT_NAME);

  constructor() { }

  getGame(id: string): Observable<Game> {
    return observableFirebaseObject(this.games.child(id), 'id');
  }

  getGamesForFantasyTeam(team: FantasyTeam): Observable<any[]> {
    return Observable.create((observer) => {
      this.teams.child(team.id).child('gameIds').on('value', (snapshot) => {
        let gameIds = snapshot.val();
        let games = [];
        for (let gId of gameIds) {
          this.games.child(gId).once('value', (snap) => {
            games.push(snap.val());
            observer.next(games);
          });
        }
      });
    });
  }


}
