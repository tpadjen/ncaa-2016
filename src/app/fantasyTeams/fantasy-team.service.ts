import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {FantasyTeam} from './fantasy-team';

let fantasyTeams: Array<FantasyTeam> = [
  {
    name: 'Team 0',
    teams: [
      {
        school: 'Kentucky',
        seed: 1
      },
      {
        school: 'Kentucky 2',
        seed: 3
      }
    ],
    id: 0
  },
  {
    name: 'Team 1',
    teams: [
      {
        school: 'Illinois',
        seed: 1
      },
      {
        school: 'Illinois 2',
        seed: 3
      }
    ],
    id: 1
  },
  {
    name: 'Team 2',
    teams: [],
    id: 2
  }
];

@Injectable()
export class FantasyTeamService {

  getTeam(id: number): Observable<FantasyTeam> {
    return Observable.of(fantasyTeams[id]);
  }

  getTeams(): Observable<Array<FantasyTeam>> {
    return Observable.of(fantasyTeams);
  }

}
