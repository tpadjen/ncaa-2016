import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromArray';
import {School} from '../schools/school';
import {SchoolService} from '../schools/school.service';

export interface FantasyTeamOptions {
  name: string;
  id: string;
  schoolIds: Array<string>;
}

export class FantasyTeam {
  name: string;
  id: string;
  schools: Array<School>;

  get points() {
    return this.schools
                .map((school) => { return school.points; })
                .reduce((a, b) => { return a + b; }, 0);
  }

  constructor();
  constructor(obj: FantasyTeamOptions, schoolService: SchoolService);
  constructor(obj?: any, schoolService?: any) {
    this.name = obj && obj.name || null;
    this.id = obj && obj.id || null;
    this.schools = obj && obj.schools || [];
    if (schoolService) {
      this._loadSchools(obj && obj.schoolIds || [], schoolService);
    }
  }

  _schoolIds;

  hasSchool(schoolId: string): boolean {
    if (this._schoolIds) {
      for (let id of Object.keys(this._schoolIds)) {
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

  _loadSchools(schoolIds: {}, schoolService: SchoolService) {
    this.schools = [];
    this._schoolIds = schoolIds;
    for (let schoolId in schoolIds) {
      if (schoolIds.hasOwnProperty(schoolId)) {
        schoolService.getSchool(schoolId).subscribe((school: School) => {
          this._addSchool(school);
          this.schools.sort((a, b) => {
            if (!a || !a.pick) { return -1; }
            if (!b || !b.pick) { return -1; }
            return a.pick.n < b.pick.n ? -1 : 1;
          });
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
