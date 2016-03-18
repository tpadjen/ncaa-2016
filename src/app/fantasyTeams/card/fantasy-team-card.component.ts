import {Component, Input} from 'angular2/core';

import {FantasyTeam} from '../fantasy-team';
import {FantasyTeamTable} from './table/fantasy-team-table.component';
import {GamesTable} from './table/games-table.component';

@Component({
  selector: 'fantasy-team-card',
  template: require('./fantasy-team-card.html'),
  styles: [`
    span.score {
      float: right;
    }
    .md-headline {
      font-weight: 600;
    }
    md-card-title-text {
      min-height: 32px;
    }
    .games {
      text-align: center;
      padding-top: 12px;
      margin-bottom: 0;
    }
  `],
  directives: [FantasyTeamTable, GamesTable]
})
export class FantasyTeamCard {

  @Input() fantasyTeam: FantasyTeam;
}
