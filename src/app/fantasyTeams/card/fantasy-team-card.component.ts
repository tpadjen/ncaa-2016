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
  `],
  directives: [FantasyTeamTable, GamesTable]
})
export class FantasyTeamCard {

  @Input() fantasyTeam: FantasyTeam;
}
