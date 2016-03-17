import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {School, SchoolOptions} from './school';
import {FantasyTeam} from '../fantasyTeams/fantasy-team';
import {DraftPick} from '../draft/draft-pick';
import {GameService} from '../games/game.service';

import {
  observableFirebaseObject,
  observableFirebaseArray
} from '../firebase/observableFirebase';

import {DRAFT_NAME} from '../../config';

@Injectable()
export class SchoolService {

  draftURL = 'https://mvhs-ncaa-2016.firebaseio.com/';
  schools = new Firebase(this.draftURL).child('schools').child(DRAFT_NAME);

  constructor(private _gameService: GameService) { }

  getSchool(id: string): Observable<School> {
    return observableFirebaseObject(this.schools.child(id), 'id')
            .map((s: SchoolOptions) => { return new School(s, this._gameService); });
  }

  getSchools(): Observable<any []> {
    return observableFirebaseArray(this.schools, 'id')
            .map((schools) => {
              return schools.map((s: SchoolOptions) => {
                return new School(s, this._gameService);
              });
            });
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
