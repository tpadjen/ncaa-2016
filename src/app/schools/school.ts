import {DRAFT_NAME} from '../../config';

export interface SchoolI {
  name: string;
  id: string;
  seed: number;
  wins: number;
  ep: number;
  region: string;
};

export class School implements SchoolI {
  name: string;
  id: string;
  seed: number;
  wins: number;
  ep: number;
  region: string;
  draftTeam: string;

  get points(): number { return this.seed * this.wins; }

  get drafted(): boolean { return this.draftTeam !== null; }

  constructor();
  constructor(obj: SchoolI);
  constructor(obj?: any) {
    this.name = obj && obj.name || null;
    this.id   = obj && obj.id   || null;
    this.seed = obj && obj.seed || null;
    this.wins = obj && obj.wins || 0;
    this.ep   = obj && obj.ep   || 0;
    this.region = obj && obj.region || null;
    this.draftTeam = obj && obj[DRAFT_NAME] || null;
  }
}
