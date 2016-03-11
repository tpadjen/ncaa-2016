import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {School, SchoolI} from './school';
import {FantasyTeam} from '../fantasyTeams/fantasy-team';
import {DraftPick} from '../draft/draft-pick';

import {
  observableFirebaseObject,
  observableFirebaseArray
} from '../firebase/observableFirebase';

import {DRAFT_NAME} from '../../config';

@Injectable()
export class SchoolService {

  draftURL = 'https://mvhs-ncaa-2016.firebaseio.com/';
  schools = new Firebase(this.draftURL).child('schools').child(DRAFT_NAME);

  getSchool(id: string): Observable<School> {
    return observableFirebaseObject(this.schools.child(id))
            .map((s: SchoolI) => { return new School(s); });
  }

  getSchools(): Observable<any []> {
    return observableFirebaseArray(this.schools, 'id')
            .map((schools) => {
              return schools.map((s: SchoolI) => {
                return new School(s);
              });
            });
  }

  draft(school: School, fantasyTeam: FantasyTeam) {
    this.schools
      .child(school.id)
      .child(DRAFT_NAME)
      .set({
        team: fantasyTeam.name,
        school: {
          id: school.id,
          name: school.name
        }
      });
  }

  undraft(pick: DraftPick) {
    this.schools
      .child(pick.school.id)
      .child(DRAFT_NAME)
      .remove();
  }

  constructor() {
    // this._setSchools();
  }

  _setSchools() {
    // let schools: Array<School> = [];
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].forEach((seed) => {
      [1, 2, 3, 4].forEach((region) => {
        this.schools.push({
          name: 'School ' + seed + ' ' + region,
          seed: seed,
          wins: 3
        });
      });
    });
  }

}
