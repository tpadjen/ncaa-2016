import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {FirebaseData, extend} from '../firebase/ng-firebase';
import 'rxjs/add/observable/fromArray';
import {School} from '../schools/school';
import {Game} from '../games/game';
import {SchoolService} from '../schools/school.service';
import {Deferred} from '../util/deferred';


let byPick = (a, b) => {
  if (!a || !a.pick) { return -1; }
  if (!b || !b.pick) { return -1; }
  return a.pick.n < b.pick.n ? -1 : 1;
};

@Injectable()
export class FantasyTeam {
  name: string;
  id: string;
  wins: number = 0;
  schoolIds: string[] = [];
  schools: School[] = [];
  gameIds: string[] = [];

  loaded: boolean = false;
  doneLoading: Deferred<any> = new Deferred();

  constructor(data: FirebaseData, private _schoolService: SchoolService) {
    extend(this, data);
    if (_schoolService) {
      this._loadSchools();
    } else {
      this.loaded = true;
    }
  }

  get points() {
    return this.schools
                .map((school) => { return school.points; })
                .reduce((a, b) => { return a + b; }, 0);
  }

  get slug(): string {
    return FantasyTeam.slugify(this.name);
  }

  get eliminated(): boolean {
    return this.schools && this.schools.length === 8 &&
            this.schools.every((school) => school.eliminated);
  }

  get schoolsLeft(): School[] {
    if (!this.schools) { return []; }
    return this.schools.filter((school) => !school.eliminated);
  }

  isDoneLoading(): Promise<any> {
    return this.doneLoading.promise;
  }

  finishLoading() {
    this.loaded = true;
    this.doneLoading.resolve();
  }

  static slugify(name: string) {
    return name.replace(' | ', '-').toLowerCase();
  }

  hasSchool(schoolId: string): boolean {
    if (this.schoolIds) {
      for (let id of Object.keys(this.schoolIds)) {
        if (id === schoolId) {
          return true;
        }
      }
    } else {
      for (let school of this.schools) {
        if (school.id === schoolId) {
          return true;
        }
      }
    }

    return false;
  }

  // must be done loading
  orderForGame(game: Game) {
    for (let i = 0; i < this.schools.length; i++) {
        if (game.schools[0] && game.schools[0].id === this.schools[i].id ||
            game.schools[1] && game.schools[1].id === this.schools[i].id) {
          return i;
        }
    }

    return -1;
  }

  _loadSchools() {
    this.schools = [];
    for (let schoolId in this.schoolIds) {
      if (this.schoolIds.hasOwnProperty(schoolId)) {
        this._schoolService.getSchool(schoolId).subscribe((school: School) => {
          this._addSchool(school);
          this.schools.sort(byPick);
          if (this.schools.length === Object.keys(this.schoolIds).length) {
            this.finishLoading();
          }
        });
      }
    }
  }

  _addSchool(school) {
    for (let i = 0; i< this.schools.length; i++) {
      let s = this.schools[i];
      if (s.id === school.id) {
        this.schools[i] = school;
        return;
      }
    }
    this.schools.push(school);
  }
}
