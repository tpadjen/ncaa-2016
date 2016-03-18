import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import {FantasyTeam, FantasyTeamOptions} from './fantasy-team';
import {School} from '../schools/school';
import {SchoolService} from '../schools/school.service';
import {Game} from '../games/game';
import {GameService} from '../games/game.service';
import {DraftPick} from '../draft/draft-pick';

import {
  observableFirebaseObject,
  observableFirebaseArray
} from '../firebase/observableFirebase';

import {DRAFT_NAME} from '../../config';

@Injectable()
export class FantasyTeamService {

  draftURL = 'https://mvhs-ncaa-2016.firebaseio.com/';
  teams = new Firebase(this.draftURL).child('teams').child(DRAFT_NAME);
  games = new Firebase(this.draftURL).child('games').child(DRAFT_NAME);
  order = new Firebase(this.draftURL).child('draft').child(DRAFT_NAME).child('order');

  constructor(
    private _schoolService: SchoolService,
    private _gameService: GameService) { }

  getTeam(id: string): any {
    return observableFirebaseObject(this.teams.child(id), 'id')
            .map((team: FantasyTeamOptions) => {
                return new FantasyTeam(team, this._schoolService);
            });
  }

  getIdFromSlug(slug: string): Promise<string> {
    return new Promise((resolve) => {
      this.teams.once('value', (snapshot) => {
        let teams = snapshot.val();
        for (let team in teams) {
          if (teams.hasOwnProperty(team)) {
            if (FantasyTeam.slugify(teams[team].name) === slug) {
              resolve(team);
            }
          }
        }
      });
    });
  }

  getTeamByOrder(order: number): Observable<FantasyTeam> {
    return Observable.create((observer) => {
      this.order.child(order.toString()).once('value', (snap) => {
        let team = snap.val();
        this.teams.child(team).once('value', (snapshot) => {
          let child = snapshot.val();
          child['id'] = snapshot.key();
          observer.next(new FantasyTeam(child, this._schoolService));
        });
      });

    });
  }

  getTeams(): any {
    return observableFirebaseArray(this.teams, 'id')
            .map((teams) => {
              return teams.map((t: FantasyTeamOptions) => {
                return new FantasyTeam(t, this._schoolService);
              });
            });
  }

  getFantasyTeamList(): Observable<Array<any>> {
    return Observable.create((observer) => {
      this.teams.once('value', (snap) => {
        let teamObj = snap.val();
        let teams = [];
        for (let key in teamObj) {
          if (teamObj.hasOwnProperty(key)) {
            teamObj[key].id = key;
            teamObj[key]['slug'] = FantasyTeam.slugify(teamObj[key]['name']);
            teams.push(teamObj[key]);
          }
        }
        observer.next(teams);
      });
    });
  }

  getGamesForTeam(team: FantasyTeam) {
    if (!team) { return Observable.empty(); }
    return Observable.create((observer) => {
      this.games.on('value', (snapshot) => {
        let games = snapshot.val();
        let teamGames = [];
        games.forEach((game) => {
          if (game.schools) {
            if (game.schools[0] && game.schools[0].id && team.hasSchool(game.schools[0].id)) {
              teamGames.push(new Game(game, this._gameService));
            }
            if (game.schools[1] && game.schools[1].id && team.hasSchool(game.schools[1].id)) {
              teamGames.push(new Game(game, this._gameService));
            }
          }
        });

        Promise.all(teamGames.map((game) => game.loading)).then(() => {
          teamGames.forEach((tg) => {
            if (tg.teams[0] && tg.teams[0].id === team.id) {
              tg.opponent = tg.teams[1];
            } else if (tg.teams[1] && tg.teams[1].id === team.id) {
              tg.opponent = tg.teams[0];
            }
          });
        });

        observer.next(teamGames);
      });
    });
  }

  draft(school: School, fantasyTeam: FantasyTeam) {
    this.teams
      .child(fantasyTeam.id)
      .child('schoolIds')
      .child(school.id)
      .set(true);
  }

  undraft(pick: DraftPick) {
    this.teams
      .child(pick.team.id)
      .child('schoolIds')
      .child(pick.school.id)
      .remove();
  }

  updateTeam(name, id) {
    this.teams
      .child(id)
      .child('name')
      .set(name);
  }

}
