import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {School} from './school';

import {
  observableFirebaseObject,
  observableFirebaseArray
} from '../firebase/observableFirebase';


@Injectable()
export class SchoolService {

  draftURL = 'https://mvhs-ncaa-2016.firebaseio.com/';
  schools = new Firebase(this.draftURL).child('schools').child('test');

  getSchool(id: string): Observable<any> {
    return observableFirebaseObject(this.schools.child(id));
  }

  getSchools(): Observable<any []> {
    return observableFirebaseArray(this.schools, 'id');
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
