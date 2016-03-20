import {
  Component,
  Input
} from 'angular2/core';
import {Spinner} from "../../spinner/spinner.component";
import {FantasyTeam} from "../fantasy-team";


@Component({
  selector: 'teams-left',
  template: `
    <div *ngFor="#school of team.schoolsLeft" class="teams-left"><spinner
      [size]="size"
      [rotating]="false"
    ></spinner></div>
  `,
  styles: [`
    .teams-left {
      display: inline-block;
    }
    spinner {
      margin-right: 1px;
    }
  `],
  directives: [Spinner]
})
export class TeamsLeft {

  @Input() team: FantasyTeam;
  @Input() size: number = 12;
}
