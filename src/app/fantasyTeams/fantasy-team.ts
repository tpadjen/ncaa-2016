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

  _loadSchools(schoolIds: {}, schoolService: SchoolService) {
    this.schools = [];
    for (let schoolId in schoolIds) {
      if (schoolIds.hasOwnProperty(schoolId)) {
        schoolService.getSchool(schoolId).subscribe((school: School) => {
          this.schools.push(school);
        });
      }
    }
  }
}
