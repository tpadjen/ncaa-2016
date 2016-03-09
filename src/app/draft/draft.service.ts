import {Injectable} from 'angular2/core';

import {School} from '../schools/school';
import {SchoolService} from '../schools/school.service';
import {FantasyTeam} from '../fantasyTeams/fantasy-team';
import {FantasyTeamService} from '../fantasyTeams/fantasy-team.service';

@Injectable()
export class DraftService {

  draftURL = 'https://mvhs-ncaa-2016.firebaseio.com/';
  draftF = new Firebase(this.draftURL).child('draft').child('test');

  constructor(
    private _schoolService: SchoolService,
    private _fantasyTeamService: FantasyTeamService) { }

  draft(school: School, fantasyTeam: FantasyTeam) {
    // this._schoolService.draft(school, fantasyTeam);
    this._fantasyTeamService.draft(school, fantasyTeam);

    this.draftF.push({
      school: school.id,
      team: fantasyTeam.name
    });

  }


}
