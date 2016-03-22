import {Injectable} from 'angular2/core';
import {FirebaseData, extend} from '../firebase/ng-firebase';

interface SimpleSchool {
  id: string;
  name: string;
}

interface SimpleTeam {
  id: string;
  name: string;
}

@Injectable()
export class DraftPick {
  id: string;
  team: SimpleTeam;
  school: SimpleSchool;

  constructor(data: FirebaseData) {
    extend(this, data);
  }
}
