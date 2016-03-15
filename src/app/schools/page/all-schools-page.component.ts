import {
  Component,
  Input,
  OnInit
} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {School} from '../school';
import {SchoolService} from '../school.service';
import {DraftService} from '../../draft/draft.service';
import {OrderByPipe} from './order-by.pipe';
import {UndraftedPipe} from './undrafted.pipe';

@Component({
  selector: 'all-schools-page',
  template: require('./all-schools-page.component.html'),
  styles: [require('./all-schools-page.component.scss')],
  pipes: [OrderByPipe, UndraftedPipe]
})
export class AllSchoolsPage implements OnInit {

  schools: Observable<School[]>;
  sortOrder: string = '-ep';
  showOnlyAvailable: boolean = false;

  constructor(
    private _schoolService: SchoolService,
    private _draftService: DraftService) { }

  ngOnInit() {
    this.schools = this._schoolService.getSchools();
  }

  draft(school: School) {
    this._draftService.draft(school);
  }

  sort(prop: string) {
    let order = this.sortOrder.substr(0, 1);
    let property = this.sortOrder.substr(1);
    if (property === prop) {
      this.sortOrder = (order === '+' ? '-' : '+') + prop;
    } else {
      this.sortOrder = (prop === 'ep' ? '-' : '+') + prop;
    }
  }

  sortingBy(prop: string): boolean {
    return this.sortOrder.substr(1) === prop;
  }

  isAscending(): boolean {
    return this.sortOrder.substr(0, 1) === '+';
  }

}
