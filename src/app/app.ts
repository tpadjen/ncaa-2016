import {Component} from 'angular2/core';
import {
  RouteConfig,
  RouterLink,
  RouterOutlet
} from 'angular2/router';
import {MATERIAL_DIRECTIVES, SidenavService, Media} from 'ng2-material/all';
import {Observable} from 'rxjs/Observable';

import {FantasyTeam} from './fantasyTeams/fantasy-team';
import {DraftService} from './draft/draft.service';

import {FantasyTeamsPage} from './fantasyTeams/page/fantasy-teams-page.component';
import {SchoolsPage} from './schools/page/schools-page.component';
import {AllSchoolsPage} from './schools/page/all-schools-page.component';
import {DraftPicksPage} from './draft/picks-page/draft-picks-page.component';
import {DraftOrderPage} from './draft/order-page/draft-order-page.component';

@Component({
  selector: 'app',
  template: require('./app.html'),
  styles: [require('./app.scss')],
  directives: [
    RouterLink,
    RouterOutlet,
    MATERIAL_DIRECTIVES,
    FantasyTeamsPage,
    SchoolsPage,
    DraftPicksPage,
    DraftOrderPage
  ]
})
@RouteConfig([
  { path: '/', name: 'Scores', component: FantasyTeamsPage, useAsDefault: true },
  { path: '/schools', name: 'Schools', component: SchoolsPage },
  { path: '/all', name: 'AllSchools', component: AllSchoolsPage },
  { path: '/picks', name: 'DraftPicks', component: DraftPicksPage },
  { path: '/order', name: 'DraftOrder', component: DraftOrderPage }
])
export class App {

  currentTeam: FantasyTeam;
  updatingTeam: Observable<boolean>;

  constructor(
    private _draftService: DraftService,
    private _sidenav: SidenavService) { }

  ngOnInit() {
    this.updatingTeam = this._draftService.updating;
    this._draftService.currentTeam.subscribe((team) => {
      this.currentTeam = team;
    });
  }

  hasMedia(breakSize: string): boolean {
    return Media.hasMedia(breakSize);
  }

  open(name: string) {
    this._sidenav.show(name);
  }
  close(name: string) {
    this._sidenav.hide(name);
  }

}
