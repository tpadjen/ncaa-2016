import {enableProdMode} from 'angular2/core';
import {bootstrap} from 'angular2/bootstrap';
import {MATERIAL_PROVIDERS} from 'ng2-material/all';
import {App} from './app/app';
import {FantasyTeamService} from './app/fantasyTeams/fantasy-team.service';
import {SchoolService} from './app/schools/school.service';
import {DraftService} from './app/draft/draft.service';

declare let __PRODUCTION__: any;
if (__PRODUCTION__) {
  enableProdMode();
}

bootstrap(App, [
  MATERIAL_PROVIDERS,
  SchoolService,
  FantasyTeamService,
  DraftService
]);
