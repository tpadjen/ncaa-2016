import {
  Component,
  Output,
  EventEmitter
} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

import {FantasyTeam} from '../../fantasyTeams/fantasy-team';

import {School} from '../school';
import {SchoolService} from '../school.service';

import {DraftService} from '../../draft/draft.service';

import {UndraftedPipe} from './undrafted.pipe';
import {Region} from './region/region.component';

interface SchoolsByRegion {
  east: Array<School>;
  west: Array<School>;
  south: Array<School>;
  midwest: Array<School>;
}

@Component({
  selector: 'schools-tab',
  template: require('./schools-tab.component.html'),
  // styles: [require('./schools-tab.component.scss')],
  directives: [MATERIAL_DIRECTIVES, Region],
  pipes: [UndraftedPipe]
})
export class SchoolsTab {

  @Output() updatingTeam: EventEmitter<boolean> = new EventEmitter<boolean>();

  schools: SchoolsByRegion;
  selected: number;

  constructor(
    private _schoolService: SchoolService,
    private _draftService: DraftService) { }

  ngOnInit() {
    this._schoolService.getSchools()
      .do((schools) => {
        this.schools = {
          east: schools.filter((school) => school.region === 'East'),
          west: schools.filter((school) => school.region === 'West'),
          south: schools.filter((school) => school.region === 'South'),
          midwest: schools.filter((school) => school.region === 'Midwest')
        };
      })
      .do(() => this.selected = null)
      .subscribe();
  }

  draft(event) {
    this.selected = event.index;
    this.updatingTeam.next(true);
    this._draftService.draft(event.school);
  }
}
