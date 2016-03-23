import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from "rxjs/subject/BehaviorSubject";
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/first';
import {DraftPick} from './draft-pick';
import {School} from '../schools/school';
import {SchoolService} from '../schools/school.service';
import {FantasyTeam} from '../fantasyTeams/fantasy-team';
import {FantasyTeamService} from '../fantasyTeams/fantasy-team.service';
import {Ng2Firebase} from 'ng2-firebase-observables/ng2-firebase-observables';
import {
  DRAFT_NAME,
  DRAFT_URL,
  NUMBER_OF_FANTASY_TEAMS
} from '../../config';

@Injectable()
export class DraftService {

  draftRef = new Firebase(DRAFT_URL).child('draft').child(DRAFT_NAME);
  draftPicks$: BehaviorSubject<DraftPick[]>;

  updating: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _schoolService: SchoolService,
    private _fantasyTeamService: FantasyTeamService) {

    this.draftPicks$ = Ng2Firebase.array(this.draftRef.child('picks'), DraftPick);
    this.draftPicks$.subscribe();
  }

  currentPick: Observable<number> = Observable.create((observer) => {
    this.draftRef.child('currentPick').on('value', (snapshot) => {
      observer.next(snapshot.val());
    });
  });

  get currentTeam(): Observable<FantasyTeam> {
    return Observable.create((observer) => {
      this._observeTeamChange(observer);

      this.draftRef.child('order').on('value', (snapshot) => {
        this._observeTeamChange(observer);
      });
    });
  }


  getDraftPicks(): Observable<DraftPick[]> {
    return this.draftPicks$;
  }

  getDraftOrder(): Observable<any []> {
    return Observable.create((observer) => {
      this.draftRef.child('order').on('value', (snap) => {
        let order = snap.val();
        this._fantasyTeamService.getTeamsFromIds(order).subscribe(teams => {
          observer.next(teams);
        });
      });
    });
  }

  updateDraftOrder(order) {
    this.draftRef.child('order').set(order);
  }

  draft(school: School) {
    this.updating.next(true);
    this.draftRef.child('currentPick').once('value', (s) => {
      let n = s.val();

      this.currentTeam.first().subscribe((fantasyTeam) => {
        this._fantasyTeamService.draft(school, fantasyTeam);

        let pickRef = this.draftRef.child('picks').push({
          n: n,
          school: {
            id: school.id,
            name: school.name
          },
          team: {
            id: fantasyTeam.id,
            name: fantasyTeam.name
          }
        });

        let pickInfo = {
          n: n,
          id: pickRef.key(),
          team: {
            id: fantasyTeam.id,
            name: fantasyTeam.name
          }
        };
        this._schoolService.draft(school, pickInfo);

        this.draftRef.child('currentPick').transaction((current) => {
          return (current || 0) + 1;
        });
      });

    });
  }

  undraft(pick: DraftPick) {
    this.updating.next(true);
    this.draftRef.child('picks').child(pick.id).remove();

    this._fantasyTeamService.undraft(pick);
    this._schoolService.undraft(pick);

    this.draftRef.child('currentPick').transaction((current) => {
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
    if (Math.floor(pick / NUMBER_OF_FANTASY_TEAMS) % 2 === 0) {
      return pick % NUMBER_OF_FANTASY_TEAMS;
    }

    return NUMBER_OF_FANTASY_TEAMS - pick % NUMBER_OF_FANTASY_TEAMS - 1;
  }

  // update fantasy team when pick changes
  _observeTeamChange(observer) {
    this.currentPick.subscribe((pick) => {
      this._fantasyTeamService.getTeamByOrder(this._getNextPick(pick)).subscribe((team) => {
        observer.next(team);
        this.updating.next(false);
      });
    });
  }


}
