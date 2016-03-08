import {Component} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

import {FantasyTeamService} from './fantasyTeams/fantasy-team.service';
import {FantasyTeamCard} from './fantasyTeams/card/fantasy-team-card.component';

@Component({
  selector: 'app',
  template: require('./app.html'),
  styles: [require('./app.scss')],
  directives: [MATERIAL_DIRECTIVES, FantasyTeamCard]
})
export class App {

  fantasyTeams = [];

  constructor(private _fantasyTeamService: FantasyTeamService) { }

  ngOnInit() {
    this._fantasyTeamService.getTeams()
      .subscribe((teams) => this.fantasyTeams = teams);
  }

}
