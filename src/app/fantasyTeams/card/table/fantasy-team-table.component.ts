import {Component, Input} from 'angular2/core';
import {FantasyTeam} from '../../fantasy-team';

@Component({
  selector: 'fantasy-team-table',
  template: require('./fantasy-team-table.html'),
  styles: [``]
})
export class FantasyTeamTable {

  @Input() fantasyTeam: FantasyTeam;

}
