import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import {FantasyTeam} from './fantasy-team';
import {School} from '../schools/school';
import {SchoolService} from '../schools/school.service';

let fantasyTeams = [
  {
    name: 'Team 0',
    schools: [0, 1, 2],
    id: 0
  },
  {
    name: 'Team 1',
    schools: [1],
    id: 1
  },
  {
    name: 'Team 2',
    schools: [2],
    id: 2
  }
];

@Injectable()
export class FantasyTeamService {

  constructor(private SchoolService: SchoolService) { }

  getTeam(id: number): Observable<FantasyTeam> {
    return Observable.create((observer) => {
      let team = fantasyTeams[id];
      let schools: Array<School> = [];
      team.schools.forEach((schoolId) => {
        this.SchoolService.getSchool(schoolId).subscribe((school: School) => {
          schools.push(school);
          if (schools.length === team.schools.length) {
            observer.next({
              name: team.name,
              id: team.id,
              schools: schools
            });
          }
        });
      });

    });
  }

  getTeams(): Observable<FantasyTeam> {
    return Observable.create((observer) => {
      fantasyTeams.forEach((team) => {
        this.getTeam(team.id).subscribe((fTeam: FantasyTeam) => { observer.next(fTeam); });
      });
    });
  }

}
