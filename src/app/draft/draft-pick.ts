interface SimpleSchool {
  id: string;
  name: string;
}

interface SimpleTeam {
  id: string;
  name: string;
}

export interface DraftPick {
  id: string;
  team: SimpleTeam;
  school: SimpleSchool;
}
