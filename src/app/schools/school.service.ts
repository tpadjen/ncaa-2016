import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {School} from './school';


let schools = [];
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].forEach((seed) => {
  [1, 2, 3, 4].forEach((region) => {
    schools.push({
      name: 'School ' + seed + ' ' + region,
      id: seed * region,
      seed: seed
    });
  });
});


@Injectable()
export class SchoolService {

  getSchool(id: number): Observable<School> {
    return Observable.of(schools[id]);
  }

  getSchools(): Observable<Array<School>> {
    return Observable.of(schools);
  }

}
