import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import {FantasyTeam, FantasyTeamOptions} from './fantasy-team';
import {School} from '../schools/school';
import {SchoolService} from '../schools/school.service';
import {DraftPick} from '../draft/draft-pick';

import {
  observableFirebaseObject,
  observableFirebaseArray
} from '../firebase/observableFirebase';

@Injectable()
export class FantasyTeamService {

  draftURL = 'https://mvhs-ncaa-2016.firebaseio.com/';
  teams = new Firebase(this.draftURL).child('teams');
  order = new Firebase(this.draftURL).child('order').child('test');

  constructor(private _schoolService: SchoolService) { }

  // getTeam(name: string): Observable<FantasyTeam> {
  //   return observableFirebaseObject(this.teams.child(name), 'name')
  //           .map((t: FantasyTeamOptions) => {
  //             return new FantasyTeam(t, this._schoolService);
  //           });
  // }

  getTeamById(id: number): Observable<FantasyTeam> {
    return Observable.create((observer) => {
      this.order.child(id.toString()).once('value', (snap) => {
        let team = snap.val();
        this.teams.child(team).once('value', (snapshot) => {
          let child = snapshot.val();
          child['name'] = snapshot.key();
          observer.next(new FantasyTeam(child, this._schoolService));
        });
      });

    });
  }

  getTeams(): any {
    return observableFirebaseArray(this.teams, 'name')
            .map((teams) => {
              return teams.map((t: FantasyTeamOptions) => {
                if (t['test']) {
                  t.schoolIds = t['test']['schoolIds'];
                } else {
                  t.schoolIds = [];
                }
                return new FantasyTeam(t, this._schoolService);
              });
            });
  }

  draft(school: School, fantasyTeam: FantasyTeam) {
    this.teams
      .child(fantasyTeam.name)
      .child('test')
      .child('schoolIds')
      .child(school.id)
      .set(true);
  }

  undraft(pick: DraftPick) {
    this.teams
      .child(pick.team)
      .child('test')
      .child('schoolIds')
      .child(pick.school.id)
      .remove();
  }

}
