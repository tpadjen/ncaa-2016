import {Component} from 'angular2/core';
import {Observable} from 'rxjs/Observable';

import {FantasyTeam} from '../../fantasyTeams/fantasy-team';

import {School} from '../school';
import {SchoolService} from '../school.service';

import {DraftService} from '../../draft/draft.service';

@Component({
  selector: 'schools-tab',
  template: require('./schools-tab.component.html')
})
export class SchoolsTab {

  schools: Observable<School[]>;

  constructor(
    private _schoolService: SchoolService,
    private _draftService: DraftService) { }

  ngOnInit() {
    this.schools = this._schoolService.getSchools()
      .map((schools: School[]) => {
        return schools.filter((school: School) => {
          return !school.drafted;
        });
      });
  }

  draft(school: School) {
    this._draftService.draft(school);
  }
}
