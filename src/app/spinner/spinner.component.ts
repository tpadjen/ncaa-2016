import {
  Component,
  Input
} from 'angular2/core';


@Component({
  selector: 'spinner',
  template: require('./spinner.component.html'),
  styles: [require('./spinner.component.scss')]
})
export class Spinner {

  @Input() size = 24;
  @Input() color: string = "black";
  @Input() rotating: boolean = true;

}
