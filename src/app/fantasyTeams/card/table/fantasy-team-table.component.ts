import {Component, Input} from 'angular2/core';
import {FantasyTeam} from '../../fantasy-team';

@Component({
  selector: 'fantasy-team-table',
  template: require('./fantasy-team-table.component.html'),
  styles: [require('./fantasy-team-table.component.scss')]
})
export class FantasyTeamTable {

  @Input() fantasyTeam: FantasyTeam;

}
