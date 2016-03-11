import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/first';

import {DraftPick} from './draft-pick';

import {School} from '../schools/school';
import {SchoolService} from '../schools/school.service';
import {FantasyTeam} from '../fantasyTeams/fantasy-team';
import {FantasyTeamService} from '../fantasyTeams/fantasy-team.service';

import {
  observableFirebaseObject,
  observableFirebaseArray
} from '../firebase/observableFirebase';

import {DRAFT_NAME} from '../../config';

const TEAMS_LENGTH = 8;

@Injectable()
export class DraftService {

  draftURL = 'https://mvhs-ncaa-2016.firebaseio.com/';
  draftF = new Firebase(this.draftURL).child('draft').child(DRAFT_NAME);

  updating = false;

  currentPick: Observable<number> = Observable.create((observer) => {
    this.draftF.child('currentPick').on('value', (snapshot) => {
        observer.next(snapshot.val());
    });
  });

  get currentTeam(): Observable<FantasyTeam> {
    return Observable.create((observer) => {
      this._observeTeamChange(observer);

      this.draftF.child('order').on('value', (snapshot) => {
        this._observeTeamChange(observer);
      });

      return () => {
        this.draftF.child('order').off('value');
      };
    });
  }

  constructor(
    private _schoolService: SchoolService,
    private _fantasyTeamService: FantasyTeamService) { }

  getDraftPicks(): Observable<any []> {
    return observableFirebaseArray(this.draftF.child('picks'), 'id');
            // .map((picks) => {
            //   return picks.map((p: DraftPick) => {
            //     return new DraftPick(p);
            //   });
            // });
  }

  getDraftOrder(): Observable<any []> {
    return observableFirebaseObject(this.draftF.child('order'))
            .do((order) => delete order['$$fbKey']);
  }

  updateDraftOrder(order) {
    this.draftF.child('order').set(order);
  }

  draft(school: School) {
    this.updating = true;
    this.currentTeam.first().subscribe((fantasyTeam) => {
      this._fantasyTeamService.draft(school, fantasyTeam);
      this._schoolService.draft(school, fantasyTeam);

      this.draftF.child('picks').push({
        school: {
          id: school.id,
          name: school.name
        },
        team: fantasyTeam.name
      });

      this.draftF.child('currentPick').transaction((current) => {
        return (current || 0) + 1;
      });
    });
  }

  undraft(pick: DraftPick) {
    this.updating = true;
    this.draftF.child('picks').child(pick.id).remove();

    this._fantasyTeamService.undraft(pick);
    this._schoolService.undraft(pick);

    this.draftF.child('currentPick').transaction((current) => {
      return (current || 0) - 1;
    });
  }

  isCurrentTeam(team: FantasyTeam) {
    this.currentTeam.subscribe((current) => {
      return current.name === team.name;
    });
  }

  // snake draft
  _getNextPick(pick: number): number {
    if (Math.floor(pick / TEAMS_LENGTH) % 2 === 0) {
      return pick % TEAMS_LENGTH;
    }

    return TEAMS_LENGTH - pick % TEAMS_LENGTH - 1;
  }

  // update fantasy team when pick changes
  _observeTeamChange(observer) {
    this.currentPick.subscribe((pick) => {
      this._fantasyTeamService.getTeamByOrder(this._getNextPick(pick)).subscribe((team) => {
        observer.next(team);
        this.updating = false;
      });
    });
  }


}
