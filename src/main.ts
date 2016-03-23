import {enableProdMode, provide} from 'angular2/core';
import {bootstrap} from 'angular2/bootstrap';
import {MATERIAL_PROVIDERS} from 'ng2-material/all';
import {App} from './app/app';
import {FantasyTeamService} from './app/fantasyTeams/fantasy-team.service';
import {SchoolService} from './app/schools/school.service';
import {DraftService} from './app/draft/draft.service';
import {GameService} from './app/games/game.service';
import {Ng2Firebase} from './app/firebase/ng2-firebase';

import {
  ROUTER_PROVIDERS,
  LocationStrategy,
  HashLocationStrategy,
  PathLocationStrategy
} from 'angular2/router';

import '!style!css!../node_modules/bootstrap/dist/css/bootstrap.css';

let APP_LOCATION_STRATEGY = provide(LocationStrategy, {useClass: HashLocationStrategy});

declare let __PRODUCTION__: any;
if (__PRODUCTION__) {
  enableProdMode();
  APP_LOCATION_STRATEGY = provide(LocationStrategy, {useClass: PathLocationStrategy});
}


bootstrap(App, [
  ROUTER_PROVIDERS,
  APP_LOCATION_STRATEGY,
  MATERIAL_PROVIDERS,
  SchoolService,
  FantasyTeamService,
  DraftService,
  GameService
])
  .then((app) => {
    Ng2Firebase.appRef = app;
  });
