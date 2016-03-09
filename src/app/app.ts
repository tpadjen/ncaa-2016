import {Component} from 'angular2/core';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

import {Observable} from 'rxjs/Observable';

import {FantasyTeam} from './fantasyTeams/fantasy-team';
import {FantasyTeamService} from './fantasyTeams/fantasy-team.service';
import {FantasyTeamCard} from './fantasyTeams/card/fantasy-team-card.component';

import {School} from './schools/school';
import {SchoolService} from './schools/school.service';

import {DraftService} from './draft/draft.service';

@Component({
  selector: 'app',
  template: require('./app.html'),
  styles: [require('./app.scss')],
  directives: [MATERIAL_DIRECTIVES, FantasyTeamCard]
})
export class App {

  fantasyTeams: Observable<FantasyTeam[]>;
  schools: Observable<School[]>;

  constructor(
    private _schoolService: SchoolService,
    private _fantasyTeamService: FantasyTeamService,
    private _draftService: DraftService) { }

  ngOnInit() {
    this.fantasyTeams = this._fantasyTeamService.getTeams();
    this.schools = this._schoolService.getSchools();
      // .subscribe((team) => {
      //   this.fantasyTeams.push(team);
      // });

  }

  draft(school: School, fantasyTeam: FantasyTeam) {
    this._draftService.draft(school, fantasyTeam);
  }

}
