import {Component} from 'angular2/core';
import {
  RouteConfig,
  RouterLink,
  RouterOutlet,
  RouteDefinition
} from 'angular2/router';
import {MATERIAL_DIRECTIVES, Media} from 'ng2-material/all';
import {Observable} from 'rxjs/Observable';

import {FantasyTeam} from './fantasyTeams/fantasy-team';
import {FantasyTeamService} from './fantasyTeams/fantasy-team.service';
import {DraftService} from './draft/draft.service';

import {FantasyTeamsPage} from './fantasyTeams/page/fantasy-teams-page.component';
import {FantasyTeamPage} from './fantasyTeams/page/fantasy-team-page.component';
import {AllSchoolsPage} from './schools/page/all-schools-page.component';
import {DraftPicksPage} from './draft/picks-page/draft-picks-page.component';
import {DraftOrderPage} from './draft/order-page/draft-order-page.component';
import {GamesPage} from './games/page/games-page.component';

import {Spinner} from './spinner/spinner.component';

declare let __PRODUCTION__: any;

let routes: RouteDefinition[] = [
  { path: '/', name: 'Scores', component: FantasyTeamsPage, useAsDefault: true },
  { path: '/teams/:slug', name: 'Team', component: FantasyTeamPage }
];

if (!__PRODUCTION__) {
  routes = routes.concat([
    { path: '/all', name: 'AllSchools', component: AllSchoolsPage },
    { path: '/picks', name: 'DraftPicks', component: DraftPicksPage },
    { path: '/order', name: 'DraftOrder', component: DraftOrderPage },
    { path: '/games', name: 'Games', component: GamesPage }
  ]);
}

@Component({
  selector: 'app',
  template: require('./app.html'),
  styles: [require('./app.scss')],
  directives: [
    RouterLink,
    RouterOutlet,
    MATERIAL_DIRECTIVES,
    FantasyTeamsPage,
    FantasyTeamPage,
    DraftPicksPage,
    DraftOrderPage,
    GamesPage,
    Spinner
  ]
})
@RouteConfig(routes)
export class App {

  currentTeam: FantasyTeam;
  updatingTeam: Observable<boolean>;

  PRODUCTION = __PRODUCTION__;

  links = [
    {
      name: 'Scores',
      route: 'Scores'
    }
  ];

  constructor(
    private _draftService: DraftService,
    private _fantasyTeamService: FantasyTeamService) {
      if (!__PRODUCTION__) {
        this.links = this.links.concat([
          {
            name: 'Schools',
            route: 'AllSchools'
          },
          {
            name: 'Picks',
            route: 'DraftPicks'
          },
          {
            name: 'Order',
            route: 'DraftOrder'
          },
          {
            name: 'Games',
            route: 'Games'
          }
        ]);
      }
    }

  ngOnInit() {
    this.updatingTeam = this._draftService.updating;
    this._draftService.currentTeam.subscribe((team) => {
      this.currentTeam = team;
    });
  }

  hasMedia(breakSize: string): boolean {
    return Media.hasMedia(breakSize);
  }

}
