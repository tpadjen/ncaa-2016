export interface SchoolI {
  name: string;
  id: string;
  seed: number;
  wins: number;
};

export class School implements SchoolI {
  name: string;
  id: string;
  seed: number;
  wins: number;
  draftTeam: string;

  get points(): number { return this.seed * this.wins; }

  get drafted(): boolean { return this.draftTeam !== null; }

  constructor();
  constructor(obj: SchoolI);
  constructor(obj?: any) {
    this.name = obj && obj.name || null;
    this.id   = obj && obj.id   || null;
    this.seed = obj && obj.seed || null;
    this.wins = obj && obj.wins || null;
    this.draftTeam = obj && obj['test'] || null;
  }
}
