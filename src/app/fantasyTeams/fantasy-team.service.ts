import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import {FantasyTeam} from './fantasy-team';
import {School} from '../schools/school';
import {SchoolService} from '../schools/school.service';
import {Game} from '../games/game';
import {DraftPick} from '../draft/draft-pick';
import {Ng2Firebase} from 'ng2-firebase-observables/ng2-firebase-observables';
import {
  DRAFT_NAME,
  DRAFT_URL
} from '../../config';

@Injectable()
export class FantasyTeamService {

  teamsRef = new Firebase(DRAFT_URL).child('teams').child(DRAFT_NAME);
  orderRef = new Firebase(DRAFT_URL).child('draft').child(DRAFT_NAME).child('order');

  teams$: BehaviorSubject<FantasyTeam[]>;

  constructor(
    private _schoolService: SchoolService) {

    this.teams$ = Ng2Firebase.array(this.teamsRef, FantasyTeam);
    this.teams$.subscribe();
  }

  getTeam(id: string): any {
    return Ng2Firebase.object(this.teamsRef.child(id), FantasyTeam);
  }

  getIdFromSlug(slug: string): Promise<string> {
    return new Promise((resolve) => {
      this.teamsRef.once('value', (snapshot) => {
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
      this.orderRef.child(order.toString()).once('value', (snap) => {
        let team = snap.val();
        this.teamsRef.child(team).once('value', (snapshot) => {
          let child = snapshot.val();
          child['id'] = snapshot.key();
          observer.next(new FantasyTeam(child, this._schoolService));
        });
      });

    });
  }

  getTeams(): Observable<FantasyTeam[]> {
    return this.teams$;
  }

  getFantasyTeamList(): Observable<Array<any>> {
    return Observable.create((observer) => {
      this.teamsRef.once('value', (snap) => {
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

  getTeamsFromIds(ids: string[]): Observable<FantasyTeam[]> {
    return Observable.create((observer) => {
      this.teams$.subscribe(teams => {
        let teamOrder = [];
        ids.forEach(id => {
          for (let team of teams) {
            if (team.id === id) {
              teamOrder.push(team);
              break;
            }
          }
        });
        observer.next(teamOrder);
      });
    });
  }

  updateWins(team: {id: string}, updateAmount: number): Promise<any> {
    return new Promise((resolve) => {
      this.teamsRef
          .child(team.id)
          .child('wins')
          .transaction((wins) => {
            return (wins || 0) + updateAmount;
          }, () => {
            resolve();
          });
    });
  }

  draft(school: School, fantasyTeam: FantasyTeam) {
    this.teamsRef
      .child(fantasyTeam.id)
      .child('schoolIds')
      .child(school.id)
      .set(true);
  }

  undraft(pick: DraftPick) {
    this.teamsRef
      .child(pick.team.id)
      .child('schoolIds')
      .child(pick.school.id)
      .remove();
  }

  updateTeam(name, id) {
    this.teamsRef
      .child(id)
      .child('name')
      .set(name);
  }

}
