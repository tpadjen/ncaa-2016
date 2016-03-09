import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import {FantasyTeam, FantasyTeamOptions} from './fantasy-team';
import {School} from '../schools/school';
import {SchoolService} from '../schools/school.service';

import {
  observableFirebaseObject,
  observableFirebaseArray
} from '../firebase/observableFirebase';

let fantasyTeams = [];
[1, 2, 3, 4, 5, 6, 7, 8].forEach((team) => {
  let schoolIds = Array.apply(null, {length: 8}).map(function(element, index) {
    return index + (team - 1)*8;
  });
  fantasyTeams.push({
    name: 'Team' + team,
    schoolIds: schoolIds,
    id: team - 1
  });
});

@Injectable()
export class FantasyTeamService {

  draftURL = 'https://mvhs-ncaa-2016.firebaseio.com/';
  teams = new Firebase(this.draftURL).child('teams');

  constructor(private _schoolService: SchoolService) { }

  getTeam(id: number): Observable<FantasyTeam> {
    return Observable.create((observer) => {
      observer.next(new FantasyTeam(fantasyTeams[id], this._schoolService));
    });
  }

  getTeams(): any {
    return observableFirebaseArray(this.teams, 'name')
            .map((teams) => {
              return teams.map((t: FantasyTeamOptions) => {
                t.schoolIds = [];
                return new FantasyTeam(t, this._schoolService);
              });
            });
  }

}
