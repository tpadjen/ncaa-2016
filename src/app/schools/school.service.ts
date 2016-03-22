import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {NgFirebase} from '../firebase/ng-firebase';
import {School} from './school';
import {DraftPick} from '../draft/draft-pick';
import {
  DRAFT_NAME,
  DRAFT_URL
} from '../../config';

@Injectable()
export class SchoolService {

  schools = new Firebase(DRAFT_URL).child('schools').child(DRAFT_NAME);

  constructor() { }

  getSchool(id: string, opts?: { load: boolean; }): Observable<School> {
    opts = opts || { load: true };
    return NgFirebase.object(this.schools.child(id), School, opts);
  }

  getSchools(): Observable<School[]> {
    return NgFirebase.array(this.schools, School);
  }

  draft(school: School, pickInfo: any) {
    this.schools
      .child(school.id)
      .child('pick')
      .set(pickInfo);
  }

  undraft(pick: DraftPick) {
    this.schools
      .child(pick.school.id)
      .child('pick')
      .remove();
  }

}
