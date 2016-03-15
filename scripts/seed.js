'use strict';

const Firebase = require('firebase');
const fs = require('fs')

const YEAR = '2016'

let fantasyTeams = [
  {
    name: 'Brookfield | Mires',
    id: 0
  },
  {
    name: 'Cary | Tingstrom',
    id: 1
  },
  {
    name: 'Flannigan | G',
    id: 2
  },
  {
    name: 'Haskell | Willihan',
    id: 3
  },
  {
    name: 'Kinder | Padjen',
    id: 4
  },
  {
    name: 'Kruse | Hoefs',
    id: 5
  },
  {
    name: 'Wood | Wood',
    id: 6
  },
  {
    name: 'Wurst | Goldson',
    id: 7
  },
];

let draftURL = 'https://mvhs-ncaa-2016.firebaseio.com/';
let schools = new Firebase(draftURL).child('schools').child(YEAR);
let draft = new Firebase(draftURL).child('draft').child(YEAR);
let teamsRef = new Firebase(draftURL).child('teams');

var loadTeams = () => {
  let data = fs.readFileSync('scripts/ncaa' + YEAR + '.csv', 'utf8');

  let teams = [];
  let id = 0;
  let region = null;

  data.split("\n").forEach((line) => {
    if (line.trim() === '') return;

    if (line.indexOf(',') === -1) {
      region = line.trim();
      return;
    }

    if (region) {
      let team = line.split(',');
      teams.push({
        name: team[1],
        seed: parseInt(team[0], 10),
        ep: parseFloat(team[2], 10),
        region: region,
        id: id,
        wins: 0
      });
      id++;
    }
  });

  return teams;
}

var seedSchools = () => {
  return new Promise((resolve, reject) => {
    schools.remove(() => {
      let teams = loadTeams();

      teams.forEach((team) => {
        schools.push(team, (err) => {
          if (err) {
            console.log(err);
            process.exit(1);
          } else {
            if (team.id === 63) {
              resolve();
            }
          }
        });
      });
    });
  })
}

var createTeams = () => {
  return new Promise((resolve, rejects) => {
    teamsRef.child(YEAR).remove(() => {
      fantasyTeams.forEach((team) => {
        teamsRef.child(YEAR).push(team, (err) => {
          if (err) {
            console.log(err);
            process.exit(1);
          } else {
            if (team.id === 7) {
              resolve();
            }
          }
        });
      });
    })
  });
}

var createDraft = () => {
  return new Promise((resolve, reject) => {
    draft.remove(() => {
      draft.child('currentPick').set(0).then(() => {
        teamsRef.child(YEAR).once('value', (snapshot) => {
          draft.child('order').set(Object.keys(snapshot.val()), (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        })
      });
    });
  });
}

createTeams().then(() => {
  console.log("Created Fantasy Teams");
  seedSchools().then(() => {
    console.log("Seeded Schools");
    createDraft().then(() => {
      console.log("Created Draft");
      process.exit(0);
    });
  });
})
