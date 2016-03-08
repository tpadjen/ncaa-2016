import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import {FantasyTeam, FantasyTeamOptions} from './fantasy-team';
import {School} from '../schools/school';
import {SchoolService} from '../schools/school.service';

let fantasyTeams = [];
[1, 2, 3, 4, 5, 6, 7, 8].forEach((team) => {
  let schoolIds = Array.apply(null, {length: 8}).map(function(element, index) { return index + (team-1)*8; });
  fantasyTeams.push({
    name: 'Team' + team,
    schoolIds: schoolIds,
    id: team - 1
  });
});

@Injectable()
export class FantasyTeamService {

  constructor(private _schoolService: SchoolService) { }

  getTeam(id: number): Observable<FantasyTeam> {
    return Observable.create((observer) => {
      observer.next(new FantasyTeam(fantasyTeams[id], this._schoolService));
    });
  }

  getTeams(): Observable<FantasyTeam> {
    return Observable.create((observer) => {
      fantasyTeams.forEach((team) => {
        this.getTeam(team.id)
          .subscribe((fantasyTeam: FantasyTeam) => {
            observer.next(fantasyTeam);
          });
      });
    });
  }

}
