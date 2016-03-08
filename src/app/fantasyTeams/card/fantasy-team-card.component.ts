import {Component, Input} from 'angular2/core';

import {FantasyTeam} from '../fantasy-team';
import {FantasyTeamTable} from './table/fantasy-team-table.component';

@Component({
  selector: 'fantasy-team-card',
  template: require('./fantasy-team-card.html'),
  directives: [FantasyTeamTable]
})
export class FantasyTeamCard {

  @Input() fantasyTeam: FantasyTeam;
}
