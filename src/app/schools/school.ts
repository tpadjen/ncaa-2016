interface SchoolI {
  name: string;
  id: number;
  seed: number;
  wins: number;
};

export class School implements SchoolI {
  name: string;
  id: number;
  seed: number;
  wins: number;

  get points(): number { return this.seed * this.wins; }

  constructor();
  constructor(obj: SchoolI);
  constructor(obj?: any) {
    this.name = obj && obj.name || null;
    this.id   = obj && obj.id   || null;
    this.seed = obj && obj.seed || null;
    this.wins = obj && obj.wins || null;
  }
}
