import {GameService} from './game.service';

export interface GameOptions {
  id: number;
  next: number; // next game id
  region: string;
  round: number;
  schools: any[]; // [0] and [1] are the two teams playing in this game
}

export class Game {
  id: number;
  next: number; // next game id
  region: string;
  round: number;
  schools: any[]; // [0] and [1] are the two teams playing in this game
  teams: any[];
  opponent: string; // name of the fantasy team opponent for this game

  constructor();
  constructor(obj: GameOptions, gameService: GameService);
  constructor(obj?: any, gameService?: any) {
    this.id = obj && obj.id || null;
    this.next = obj && obj.next || null;
    this.region = obj && obj.region || null;
    this.round = obj && obj.round || null;
    this.schools = obj && obj.schools || [];
    if (gameService) {
      this._loadTeams(this.schools, gameService);
    }
  }

  _loadTeams(schools: any[], gameService: GameService) {
    this.teams = [];
    schools.forEach((school, i) => {
      gameService.getSchoolForGame(school).first().subscribe((s) => {
        if (s.pick) {
          this.teams[i] = s.pick.team;
        }
      });
    });
  }

}
