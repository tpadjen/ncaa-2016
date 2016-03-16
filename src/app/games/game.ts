export interface Game {
  id: number;
  next: number; // next game id
  region: string;
  round: number;
  schools: any[]; // [0] and [1] are the two teams playing in this game
}
