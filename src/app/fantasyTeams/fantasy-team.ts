import {School} from '../schools/school';
import {SchoolService} from '../schools/school.service';

export interface FantasyTeamOptions {
  name: string;
  id: number;
  schoolIds: Array<number>;
}

export class FantasyTeam {
  name: string;
  id: number;
  schools: Array<School>;

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

  _loadSchools(schoolIds: Array<number>, schoolService: SchoolService) {
    this.schools = [];
    schoolIds.forEach((schoolId) => {
      schoolService.getSchool(schoolId).subscribe((school: School) => {
        this.schools.push(school);
      });
    });
  }
}
