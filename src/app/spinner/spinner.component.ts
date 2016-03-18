import {
  Component,
  Input
} from 'angular2/core';


@Component({
  selector: 'spinner',
  template: `
    <object
      class="rotating"
      data="assets/img/basketball.svg"
      type="image/svg+xml"
      width="{{size}}px"
      height="{{size}}px"></object>
  `,
  styles: [require('./spinner.component.scss')]
})
export class Spinner {

  @Input() size = 24;

}
