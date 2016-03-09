interface SimpleSchool {
  id: string;
  name: string;
}

export interface DraftPick {
  id: string;
  team: string;
  school: SimpleSchool;
}
