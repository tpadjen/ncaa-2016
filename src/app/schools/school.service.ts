import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Ng2Firebase} from 'ng2-firebase-observables/ng2-firebase-observables';
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
    this.schools$ = Ng2Firebase.array(this.schoolsRef, School);
    this.schools$.subscribe();
  }

  getSchool(id: string, opts?: { load: boolean; }): Observable<School> {
    opts = opts || { load: true };
    return Ng2Firebase.object(this.schoolsRef.child(id), School, opts);
  }

  getSchools(): Observable<School[]> {
    return this.schools$;
  }

  getPickedTeam(schoolId: string): Promise<{ id: string, name: string; }> {
    return new Promise((resolve) => {
      this.schools$.subscribe((schools) => {
        if (schools.length > 0) {
          for (let school of schools) {
            if (school.id === schoolId) {
              resolve(school.pick.team);
            }
          }
        }
      });
    });
  }

  updateWins(schoolId: string, updateAmount: number): Promise<any> {
    return new Promise((resolve) => {
      this.schoolsRef
          .child(schoolId)
          .child('wins')
          .transaction((wins) => {
            return (wins || 0) + updateAmount;
          }, () => resolve());
    });
  }

  setEliminated(schoolId: string, eliminated: boolean) {
    return this.schoolsRef
                .child(schoolId)
                .child('eliminated').set(eliminated);
  }

  addGameId(gameId: string, schoolId: string) {
    return this.schoolsRef
                .child(schoolId)
                .child('gameIds')
                .child(gameId)
                .set(true);
  }

  removeGameId(gameId: string, schoolId: string) {
    return this.schoolsRef
                .child(schoolId)
                .child('gameIds')
                .child(gameId)
                .remove();
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
