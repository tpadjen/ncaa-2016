import {
  Component,
  Input,
  Output,
  EventEmitter
} from 'angular2/core';

import {School} from '../../school';

@Component({
  selector: 'region',
  template: require('./region.component.html'),
  styles: [require('./region.component.scss')]
})
export class Region {

  @Input() schools: Array<School>;
  @Output() drafted = new EventEmitter();

  draft(school: School, index: number) {
    this.drafted.emit({school: school, index: index});
  }
}
