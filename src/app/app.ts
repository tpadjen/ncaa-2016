import {Component} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

@Component({
  selector: 'app',
  template: require('./app.html'),
  styles: [require('./app.scss')],
  directives: [MATERIAL_DIRECTIVES]
})
export class App { }
