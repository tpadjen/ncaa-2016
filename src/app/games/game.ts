import {
  Injectable,
  Inject,
  forwardRef
} from 'angular2/core';
import {FirebaseData, extend} from '../firebase/ng2-firebase';
import {FantasyTeam} from '../fantasyTeams/fantasy-team';
import {SchoolService} from '../schools/school.service';

@Injectable()
export class Game {
  id: number;
  next: number; // next game id
  region: string;
  round: number;

  // [0] and [1] are the two teams playing in this game
  schools: { id: string; name: string; seed: number; }[] = [];
  teams: any[];
  winner: string;

  _schoolService;
  constructor(
    data: FirebaseData,
    @Inject(forwardRef(() => SchoolService)) _schoolService: SchoolService
  ) {
    this._schoolService = _schoolService;
    extend(this, data);
    if (_schoolService) { this._loadSchools(); }
  }

  // fantasy team opponent for this game
  opponent(team: FantasyTeam) {
    if (this.teams[0] && this.teams[0].id === team.id) {
      return this.teams[1];
    } else if (this.teams[1] && this.teams[1].id === team.id) {
      return this.teams[0];
    }
    return null;
  }

  _loadSchools() {
    this.teams = [];
    this.schools.forEach((school, i) => {
      this._schoolService.getSchool(school.id, {load: false}).first().subscribe((s) => {
        if (s.pick) {
          this.teams[i] = s.pick.team;
        }
      });
    });
  }

}
