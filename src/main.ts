import {enableProdMode} from 'angular2/core';
import {bootstrap} from 'angular2/bootstrap';
import {MATERIAL_PROVIDERS} from 'ng2-material/all';
import {App} from './app/app';

declare let __PRODUCTION__: any;
if (__PRODUCTION__) {
  enableProdMode();
}

bootstrap(App, [
  MATERIAL_PROVIDERS
]);
