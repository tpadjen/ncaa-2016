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
      // set winner id
      this.games.child(game.id.toString()).child('winner').set(game.schools[index].id, () => {
        // get next game
        this.games.child(game.next.toString()).once('value', (snap) => {
          // setup next game
          let next = snap.val();
          let schools = next.schools || [];
          let nextSpot = 0;
          if (next.prev1 === game.id) {
            nextSpot = 1;
          }
          schools[nextSpot] = game.schools[index];

          // save next game
          this.games.child(game.next.toString()).child('schools').set(schools, () => {
            // add new game to school's gameIds
            let add = this.schools
                            .child(game.schools[index].id)
                            .child('gameIds')
                            .child(next.id)
                            .set(true);

            // increase school wins
            add.then(() => {
              this.schools
                    .child(game.schools[index].id)
                    .child('wins')
                    .transaction((wins) => {
                      return (wins || 0) + 1;
                    }, () => {

                      // eliminate other team
                      this.schools
                            .child(game.schools[index === 0 ? 1 : 0].id)
                            .child('eliminated').set(true, () => {

                              // get reference to winning fantasyTeam
                              this.schools
                                    .child(game.schools[index].id)
                                    .child('pick')
                                    .child('team')
                                    .child('id')
                                    .once('value', (s) => {
                                      // increase # of wins so team updates
                                      this.teams
                                            .child(s.val())
                                            .child('wins')
                                            .transaction((wins) => {
                                              return (wins || 0) + 1;
                                            }, () => {
                                              resolve();
                                            });
                                    });
                            });

                    });
            });

          });

        });

      });
    });
  }

  undoWin(game: Game): Promise<any> {
    return new Promise((resolve) => {
      // undo set winner id
      this.games.child(game.id.toString()).child('winner').set(null, () => {
        // get next game
        this.games.child(game.next.toString()).once('value', (snap) => {
          // setup next game
          let next = snap.val();
          let schools = next.schools || [];
          let nextSpot = 0;
          if (next.prev1 === game.id) {
            nextSpot = 1;
          }
          schools[nextSpot] = null;

          // save next game
          this.games.child(game.next.toString()).child('schools').set(schools, () => {
            // remove game from school's gameIds
            let add = this.schools
                            .child(game.winner)
                            .child('gameIds')
                            .child(next.id)
                            .remove();

            // decrease school wins
            add.then(() => {
              this.schools
                    .child(game.winner)
                    .child('wins')
                    .transaction((wins) => {
                      return (wins || 0) - 1;
                    }, () => {

                      // de-eliminate other team
                      let eliminated = 0;
                      if (game.schools[0].id === game.winner) {
                        eliminated = 1;
                      }
                      this.schools
                            .child(game.schools[eliminated].id)
                            .child('eliminated').set(false, () => {

                              // get reference to winning fantasyTeam
                              this.schools
                                    .child(game.winner)
                                    .child('pick')
                                    .child('team')
                                    .child('id')
                                    .once('value', (s) => {
                                      // decrease # of wins so team updates
                                      this.teams
                                            .child(s.val())
                                            .child('wins')
                                            .transaction((wins) => {
                                            return (wins || 0) - 1;
                                            }, () => {
                                              resolve();
                                            });
                                    });
                            });
                    });
            });

          });

        });

      });
    });
  }


}
