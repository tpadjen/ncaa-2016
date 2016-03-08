import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {School} from './school';

let schools: Array<School> = [
  {
    name: 'Kentucky',
    id: 4,
    seed: 1
  },
  {
    name: 'Illinois',
    id: 4,
    seed: 3
  },
  {
    name: 'Perdue',
    id: 4,
    seed: 12
  }

];

@Injectable()
export class SchoolService {

  getSchool(id: number): Observable<School> {
    return Observable.of(schools[id]);
  }

  getSchools(): Observable<Array<School>> {
    return Observable.of(schools);
  }

}
