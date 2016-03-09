import {Component} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

import {Observable} from 'rxjs/Observable';

import {FantasyTeamService} from './fantasyTeams/fantasy-team.service';
import {FantasyTeamCard} from './fantasyTeams/card/fantasy-team-card.component';

@Component({
  selector: 'app',
  template: require('./app.html'),
  styles: [require('./app.scss')],
  directives: [MATERIAL_DIRECTIVES, FantasyTeamCard]
})
export class App {

  fantasyTeams: Observable<any []>;

  constructor(private _fantasyTeamService: FantasyTeamService) { }

  ngOnInit() {
    this.fantasyTeams = this._fantasyTeamService.getTeams();
      // .subscribe((team) => {
      //   this.fantasyTeams.push(team);
      // });

  }

}
