import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Observable} from 'rxjs/Observable';

import {FantasyTeam} from '../fantasy-team';
import {FantasyTeamService} from '../fantasy-team.service';
import {FantasyTeamCard} from '../card/fantasy-team-card.component';

@Component({
  selector: 'fantasy-team-page',
  template: require('./fantasy-team-page.component.html'),
  directives: [
    FantasyTeamCard
  ]
})
export class FantasyTeamPage {

  fantasyTeam: FantasyTeam;

  constructor(
    private _fantasyTeamService: FantasyTeamService,
    private _routeParams: RouteParams) { }

  ngOnInit() {
    this._fantasyTeamService.getIdFromSlug(this._routeParams.get('slug')).then((id) => {
      this._fantasyTeamService.getTeam(id).subscribe((team) => {
        this.fantasyTeam = team;
      });
    });
  }

}
