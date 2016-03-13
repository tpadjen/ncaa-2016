import {enableProdMode} from 'angular2/core';
import {bootstrap} from 'angular2/bootstrap';
import {MATERIAL_PROVIDERS} from 'ng2-material/all';
import {App} from './app/app';
import {FantasyTeamService} from './app/fantasyTeams/fantasy-team.service';
import {SchoolService} from './app/schools/school.service';
import {DraftService} from './app/draft/draft.service';
import {ROUTER_PROVIDERS} from 'angular2/router';

declare let __PRODUCTION__: any;
if (__PRODUCTION__) {
  enableProdMode();
}

bootstrap(App, [
  ROUTER_PROVIDERS,
  MATERIAL_PROVIDERS,
  SchoolService,
  FantasyTeamService,
  DraftService
]);
