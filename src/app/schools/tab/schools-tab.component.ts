import {
  Component,
  Output,
  EventEmitter
} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import {FantasyTeam} from '../../fantasyTeams/fantasy-team';

import {School} from '../school';
import {SchoolService} from '../school.service';

import {DraftService} from '../../draft/draft.service';

import {UndraftedPipe} from './undrafted.pipe';

@Component({
  selector: 'schools-tab',
  template: require('./schools-tab.component.html'),
  styles: [require('./schools-tab.component.scss')],
  pipes: [UndraftedPipe]
})
export class SchoolsTab {

  @Output() updatingTeam: EventEmitter<boolean> = new EventEmitter<boolean>();

  schools: Observable<School[]>;
  selected: number;

  constructor(
    private _schoolService: SchoolService,
    private _draftService: DraftService) { }

  ngOnInit() {
    this.schools = this._schoolService.getSchools()
      .do(() => { this.selected = null; });
  }

  draft(school: School, index: number) {
    this.selected = index;
    this.updatingTeam.next(true);
    this._draftService.draft(school);
  }
}
