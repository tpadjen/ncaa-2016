'use strict';

const Firebase = require('firebase');
const fs = require('fs')

const YEAR = '2017'

let fantasyTeams = [
  {
    name: 'Brookfield | Mires',
    id: 0,
    wins: 0
  },
  {
    name: 'Cary | Tingstrom',
    id: 1,
    wins: 0
  },
  {
    name: 'Flannigan | G',
    id: 2,
    wins: 0
  },
  {
    name: 'Haskell | Willihan',
    id: 3,
    wins: 0
  },
  {
    name: 'Kinder | Padjen',
    id: 4,
    wins: 0
  },
  {
    name: 'Hoefs | Fisher',
    id: 5,
    wins: 0
  },
  {
    name: 'Wood | Wood',
    id: 6,
    wins: 0
  },
  {
    name: 'Wurst | Goldson',
    id: 7,
    wins: 0
  },
];

let draftURL = 'https://mvhs-ncaa-2017.firebaseio.com/';
let schoolsRef = new Firebase(draftURL).child('schools').child(YEAR);
let draftRef   = new Firebase(draftURL).child('draft').child(YEAR);
let teamsRef   = new Firebase(draftURL).child('teams').child(YEAR);
let gamesRef   = new Firebase(draftURL).child('games').child(YEAR);

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
        wins: 0,
        eliminated: false
      });
      id++;
    }
  });

  return teams;
}

var createSchools = () => {
  return new Promise((resolve, reject) => {
    schoolsRef.remove(() => {
      let teams = loadTeams();

      teams.forEach((team) => {
        schoolsRef.push(team, (err) => {
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
    teamsRef.remove(() => {
      fantasyTeams.forEach((team) => {
        teamsRef.push(team, (err) => {
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
    draftRef.remove(() => {
      draftRef.child('currentPick').set(0).then(() => {
        teamsRef.once('value', (snapshot) => {
          draftRef.child('order').set(Object.keys(snapshot.val()), (err) => {
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

let SEED_ORDER = [1, 16, 8, 9, 5, 12, 4, 13, 6, 11, 3, 14, 7, 10, 2, 15];

let orderBySeed = (a, b) => {
  return SEED_ORDER.indexOf(a.seed) < SEED_ORDER.indexOf(b.seed) ? -1 : 1;
};

Object.defineProperty(Array.prototype, 'chunk', {
  value: function(chunkSize) {
    var R = [];
    for (var i=0; i<this.length; i+=chunkSize)
      R.push(this.slice(i,i+chunkSize));
    return R;
  }
});

if (!Array.prototype.last){
  Array.prototype.last = function(){
    return this[this.length - 1];
  };
};

let createGames = () => {
  return new Promise((resolve, reject) => {
    gamesRef.remove(() => {
      schoolsRef.once('value', (snapshot) => {
        let teams = snapshot.val();
        let regions = {
          South: [],
          West: [],
          East: [],
          Midwest: []
        }
        let games = {
          South: [],
          West: [],
          East: [],
          Midwest: [],
          FinalFour: []
        }

        for (let teamId in teams) {
          if (teams.hasOwnProperty(teamId)) {
            let team = teams[teamId];
            team.id = teamId;
            regions[teams[teamId].region].push(team);
          }
        }

        let setGameIds = [];
        let regionPromises = [];
        let gameId = 0;
        ['South', 'West', 'East', 'Midwest'].forEach((region) => {
          regions[region].sort(orderBySeed);
          let index = 0;
          regions[region].chunk(2).forEach((matchup) => {
            let game = {
              schools: [{
                  id: matchup[0].id,
                  name: matchup[0].name,
                  seed: SEED_ORDER[index]
                },
                {
                  id: matchup[1].id,
                  name: matchup[1].name,
                  seed: SEED_ORDER[index+1]
                }
              ],
              id: gameId++,
              region: region,
              round: 1
            };

            index += 2;

            games[region].push(game);
            setGameIds.push(new Promise((resolve) => {
              let a0 = {};
              a0[game.id] = true;
              let set0 = schoolsRef.child(matchup[0].id).child('gameIds').set(a0);
              let a1 = {};
              a1[game.id] = true;
              let set1 = schoolsRef.child(matchup[1].id).child('gameIds').set(a1);
              set0.then(() => {
                set1.then(() => {
                  resolve();
                });
              });
            }));
          });

          regionPromises.push(new Promise((resolve) => {
            let thirsty = [];
            games[region].chunk(2).forEach((prevGames) => {
              thirsty.push({
                id: gameId++,
                region: region,
                prev0: prevGames[0].id,
                prev1: prevGames[1].id,
                round: 2
              });
            });

            let sweet = [];
            thirsty.chunk(2).forEach((prevGames) => {
              sweet.push({
                id: gameId++,
                region: region,
                prev0: prevGames[0].id,
                prev1: prevGames[1].id,
                round: 3
              });
            });

            let elite = [];
            sweet.chunk(2).forEach((prevGames) => {
              elite.push({
                id: gameId++,
                region: region,
                prev0: prevGames[0].id,
                prev1: prevGames[1].id,
                round: 4
              });
            });

            games[region] = games[region].concat(thirsty).concat(sweet).concat(elite);
            resolve();
          }));

        });

        Promise.all(setGameIds.concat(regionPromises)).then(() => {
          // 2016 South vs West
          // games.FinalFour.push({
          //   id: gameId++,
          //   region: 'Final Four',
          //   prev0: games.South.last().id,
          //   prev1: games.West.last().id,
          //   round: 5
          // });

          // games.FinalFour.push({
          //   id: gameId++,
          //   region: 'Final Four',
          //   prev0: games.East.last().id,
          //   prev1: games.Midwest.last().id,
          //   round: 5
          // });

          // 2017 East vs West
          games.FinalFour.push({
            id: gameId++,
            region: 'Final Four',
            prev0: games.East.last().id,
            prev1: games.West.last().id,
            round: 5
          });

          games.FinalFour.push({
            id: gameId++,
            region: 'Final Four',
            prev0: games.Midwest.last().id,
            prev1: games.South.last().id,
            round: 5
          });

          games.FinalFour.push({
            id: gameId++,
            region: 'Championship',
            prev0: games.FinalFour[0].id,
            prev1: games.FinalFour[1].id,
            round: 6
          });

          let gameList = games.South
                            .concat(games.West)
                            .concat(games.East)
                            .concat(games.Midwest)
                            .concat(games.FinalFour);

          // set nexts based on prev
          gameList.forEach((game) => {
            if (game.prev0 !== null && game.prev0 !== undefined) {
              gameList[game.prev0]['next'] = game.id;
              gameList[game.prev1]['next'] = game.id;
            }
          });

          gamesRef.set(gameList, (err) => {
            resolve();
          });
        });


      });
    });
  })
};

createTeams().then(() => {
  console.log("Created Fantasy Teams");
  createSchools().then(() => {
    console.log("Created Schools");
    createGames().then(() => {
      console.log("Created Games");
      createDraft().then(() => {
        console.log("Created Draft");
        process.exit(0);
      });
    });
  });
});

// createGames().then(() => {
//   console.log("Created Games");
//   process.exit(0)
// });
