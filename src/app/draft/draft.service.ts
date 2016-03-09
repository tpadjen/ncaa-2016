import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';

import {DraftPick} from './draft-pick';

import {School} from '../schools/school';
import {SchoolService} from '../schools/school.service';
import {FantasyTeam} from '../fantasyTeams/fantasy-team';
import {FantasyTeamService} from '../fantasyTeams/fantasy-team.service';

import {
  observableFirebaseObject,
  observableFirebaseArray
} from '../firebase/observableFirebase';

@Injectable()
export class DraftService {

  draftURL = 'https://mvhs-ncaa-2016.firebaseio.com/';
  draftF = new Firebase(this.draftURL).child('draft').child('test');

  constructor(
    private _schoolService: SchoolService,
    private _fantasyTeamService: FantasyTeamService) { }

  getDraftPicks(): Observable<any []> {
    return observableFirebaseArray(this.draftF, 'id');
            // .map((picks) => {
            //   return picks.map((p: DraftPick) => {
            //     return new DraftPick(p);
            //   });
            // });
  }

  draft(school: School, fantasyTeam: FantasyTeam) {
    this._schoolService.draft(school, fantasyTeam);
    this._fantasyTeamService.draft(school, fantasyTeam);

    this.draftF.push({
      school: {
        id: school.id,
        name: school.name
      },
      team: fantasyTeam.name
    });
  }

  undraft(pick: DraftPick) {
    this.draftF.child(pick.id).remove();

    this._fantasyTeamService.undraft(pick);
    this._schoolService.undraft(pick);
  }


}
