import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import {FantasyTeam, FantasyTeamOptions} from './fantasy-team';
import {School} from '../schools/school';
import {SchoolService} from '../schools/school.service';


let fantasyTeams: Array<FantasyTeamOptions> = [
  {
    name: 'Team 0',
    schoolIds: [0, 1, 2],
    id: 0
  },
  {
    name: 'Team 1',
    schoolIds: [1],
    id: 1
  },
  {
    name: 'Team 2',
    schoolIds: [2],
    id: 2
  }
];

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
