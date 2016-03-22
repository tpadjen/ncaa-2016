import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from "rxjs/subject/BehaviorSubject";
import {NgFirebase} from '../firebase/ng-firebase';
import {School} from './school';
import {DraftPick} from '../draft/draft-pick';
import {
  DRAFT_NAME,
  DRAFT_URL
} from '../../config';

@Injectable()
export class SchoolService {

  schoolsRef = new Firebase(DRAFT_URL).child('schools').child(DRAFT_NAME);
  schools$: BehaviorSubject<School[]>;

  constructor() {
    this.schools$ = NgFirebase.array(this.schoolsRef, School);
    this.schools$.subscribe();
  }

  getSchool(id: string, opts?: { load: boolean; }): Observable<School> {
    opts = opts || { load: true };
    return NgFirebase.object(this.schoolsRef.child(id), School, opts);
  }

  getSchools(): Observable<School[]> {
    return this.schools$;
  }

  draft(school: School, pickInfo: any) {
    this.schoolsRef
      .child(school.id)
      .child('pick')
      .set(pickInfo);
  }

  undraft(pick: DraftPick) {
    this.schoolsRef
      .child(pick.school.id)
      .child('pick')
      .remove();
  }

}
