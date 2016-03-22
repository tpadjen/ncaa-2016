import {
  Injectable,
  Inject,
  forwardRef
} from 'angular2/core';
import {FirebaseData, extend} from '../firebase/ng-firebase';
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

  // name of the fantasy team opponent for this game
  opponent: string;
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
