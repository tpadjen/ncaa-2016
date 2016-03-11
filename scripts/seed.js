'use strict';

const Firebase = require('firebase');
const fs = require('fs')

const YEAR = '2015'

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
      region = line;
      return;
    }

    if (region) {
      let team = line.split(',');
      teams.push({
        name: team[1],
        seed: parseInt(team[0], 10),
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

var createDraft = () => {
  return new Promise((resolve, reject) => {
    draft.remove(() => {
      draft.child('currentPick').set(0).then(() => {
        teamsRef.once('value', (snapshot) => {
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

seedSchools().then(() => {
  console.log("Seeded Schools");
  createDraft().then(() => {
    console.log("Created Draft");
    process.exit(0);
  });
});
