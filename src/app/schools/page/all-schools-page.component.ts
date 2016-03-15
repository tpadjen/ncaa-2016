import {
  Component,
  Input,
  OnInit
} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {School} from '../school';
import {SchoolService} from '../school.service';

@Component({
  selector: 'all-schools-page',
  template: require('./all-schools-page.component.html'),
  styles: [require('./all-schools-page.component.scss')]
})
export class AllSchoolsPage implements OnInit {

  schools: Observable<School[]>;

  constructor(private _schoolService: SchoolService) { }

  ngOnInit() {
    this.schools = this._schoolService.getSchools();
  }

}
