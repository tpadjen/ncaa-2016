import {Component} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

import {FantasyTeamService} from './fantasy-team.service';

@Component({
  selector: 'app',
  template: require('./app.html'),
  styles: [require('./app.scss')],
  directives: [MATERIAL_DIRECTIVES]
})
export class App {

  fantasyTeams = [];

  constructor(private _fantasyTeamService: FantasyTeamService) { }

  ngOnInit() {
    this._fantasyTeamService.getTeams()
      .subscribe((teams) => this.fantasyTeams = teams);
  }

}
