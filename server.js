//CS340 Brandon Lo server javascript
var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();

//how to utalize default layouts 
//https://stackoverflow.com/questions/26854207/cannot-install-handlebars-on-node-from-command-line
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});
app.use(bodyParser.urlencoded({
  extended: false
}))
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
//set the port so we don't have to keep passing it as an arguement
app.set('port', 8117);
app.use(express.static('public'));

var Handlebars = require('handlebars');

//register helper to create an increment function
//grabbed from here
//https://stackoverflow.com/questions/22103989/adding-offset-to-index-when-looping-through-items-in-handlebars
Handlebars.registerHelper("inc", function(value, options){
  return parseInt(value) + 1;
});

//Function to get the teams
//how to use mysql pool query 
//https://www.npmjs.com/package/mysql-pool
function getTeams(req, res, next){
  mysql.pool.query('SELECT * FROM teams', function(err, rows, fields){
    if (err){
      next(err);
      return;
    }
    req.teams = rows;
    return next();
  });
}

//Function that grabs the position groups such as Offense/Defense/Special Teams
function getGroups(req, res, next){
  mysql.pool.query('SELECT * FROM positionGroup', function(err, rows, fields){
    if (err){
      next(err);
      return;
    }
    req.positionGroup = rows;
    return next();
  });
}

//Gets the Positions such as RB/WR/QB/DB etc...
function getPositions(req, res, next){
  mysql.pool.query('SELECT * FROM positions', function(err, rows, fields){
    if (err){
      next(err);
      return;
    }
    req.positions = rows;
    return next();
  })
}

//Grabs the players form the players table
function getPlayers(req, res, next){
  mysql.pool.query('SELECT * FROM player', function(err, rows, fields){
    if (err){
      next(err);
      return;
    }
    req.players = rows;
    return next();
  })
}

//Gets the offensive stats from the players
function getOff(req, res, next){
  mysql.pool.query('SELECT * from offensiveStats', function(err, rows, fields){
    if (err){
      next(err);
      return;
    }
    req.offensiveStats = rows
    return next();
  })
}

//Grabs the defensive stats from the players
function getDef(req, res, next){
  mysql.pool.query('SELECT * from defensiveStats', function(err, rows, fields){
    if (err){
      next(err);
      return;
    }
    req.defensiveStats = rows
    return next();
  })
}

//Grabs the special teams stats
function getSpec(req, res, next){
  mysql.pool.query('SELECT * from specialTeamsStats', function(err, rows, fields){
    if (err){
      next(err);
      return;
    }
    req.specialTeamsStats = rows
    return next();
  })
}

//Renders the tables
function renderTablePage(req, res){
  res.render('tables',{
    teams: req.teams, positionGroup: req.positionGroup, positions: req.positions, players: req.players, offensiveStats: req.offensiveStats, defensiveStats: req.defensiveStats, specialTeamsStats: req.specialTeamsStats
  });
}

//when the home page is called
app.get('/tables', getTeams, getGroups, getPositions, getPlayers, getOff, getDef, getSpec, renderTablePage);

//Insert function to inser the values
app.use('/insert', getTeams, getGroups, getPositions, getPlayers, getOff, getDef, getSpec, function(req, res){
  res.render('insert',{
    teams: req.teams, positionGroup: req.positionGroup, positions: req.positions, players: req.players, offensiveStats: req.offensiveStats, defensiveStats: req.defensiveStats, specialTeamsStats: req.specialTeamsStats
  });
});

//insert function to create new teams
//how to insert into 
//https://www.w3schools.com/sql/sql_insert.asp
app.get('/insertTeam', getGroups, getPositions, getPlayers, getOff, getDef, getSpec, function(req, res, next){
  mysql.pool.query('INSERT INTO `teams`(`city`, `mascot`, `stadium`) VALUES (?, ?, ?)', [req.query.city, req.query.mascot, req.query.stadium], function(err, result){
    if (err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT * FROM teams', function(err, rows, fields){
      if (err){
        next(err);
        return;
      }
      req.teams = rows;
      res.render('insert',{
        teams: req.teams, positionGroup: req.positionGroup, positions: req.positions, players: req.players, offensiveStats: req.offensiveStats, defensiveStats: req.defensiveStats, specialTeamsStats: req.specialTeamsStats
      });
    });
  });
});

//insert function to create new players
app.get('/insertPlayer', getTeams, getGroups, getPositions, getOff, getDef, getSpec, function(req, res, next){
  mysql.pool.query('INSERT INTO `player`(`pNumber`, `firstName`, `lastName`, `age`, `team`, `positionGroup`, `position`) VALUES (?,?,?,?,?,?,?)', [req.query.pNumber, req.query.firstName, req.query.lastName, req.query.age, req.query.mascot, req.query.positionGroup, req.query.position], function(err, result){
    if (err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT * FROM player', function(err, rows, fields){
      if (err){
        next(err);
        return;
      }
      req.players = rows;
      res.render('insert',{
        teams: req.teams, positionGroup: req.positionGroup, positions: req.positions, players: req.players, offensiveStats: req.offensiveStats, defensiveStats: req.defensiveStats, specialTeamsStats: req.specialTeamsStats
      });
    });
  });
});

//insert function to adjust the offensive stats of players
app.get('/insertOf', getTeams, getGroups, getPositions, getPlayers, getDef, getSpec, function(req, res, next){
  mysql.pool.query('INSERT INTO `offensiveStats`(`playerNumber`, `passingAttempts`, `passesCompleted`, `passingYards`, `rushingYards`, `rushingAttempts`, `receptions`, `targets`,`receivingYards`)VALUES (?,?,?,?,?,?,?,?,?)', [req.query.playerNumber, req.query.passingAttempts, req.query.passesCompleted, req.query.passingYards, req.query.rushingYards, req.query.rushingAttempts, req.query.receptions, req.query.targets, req.query.receivingYards], function(err, result){
    if (err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT * FROM offensiveStats', function(err, rows, fields){
      if (err){
        next(err);
        return;
      }
      req.offensiveStats = rows;
      res.render('insert',{
        teams: req.teams, positionGroup: req.positionGroup, positions: req.positions, players: req.players, offensiveStats: req.offensiveStats, defensiveStats: req.defensiveStats, specialTeamsStats: req.specialTeamsStats
      });
    });
  });
});

//insert function to adjust the defensive stats of players
app.get('/insertDef', getTeams, getGroups, getPositions, getPlayers, getOff, getSpec, function(req, res, next){
  mysql.pool.query('INSERT INTO `defensiveStats`(`playerNumber`, `sacks`, `tackles`,`forcedFumbles`,`interceptions`) VALUES (?,?,?,?,?)', [req.query.playerNumber, req.query.sacks, req.query.tackles, req.query.forcedFumbles, req.query.interceptions], function(err, result){
    if (err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT * defensiveStats', function(err, rows, fields){
      if (err){
        next(err);
        return;
      }
      req.defensiveStats = rows;
      res.render('insert',{
        teams: req.teams, positionGroup: req.positionGroup, positions: req.positions, players: req.players, offensiveStats: req.offensiveStats, defensiveStats: req.defensiveStats, specialTeamsStats: req.specialTeamsStats
      });
    });
  });
});

//update function to adjust the defensive stats of players
//how to SQL to update
//https://www.w3schools.com/sql/sql_update.asp
app.get('/updateTeams', getTeams, getGroups, getPositions, getPlayers, getOff, getDef, getSpec, function(req, res, next){
  var context = {};
  mysql.pool.query("SELECT * FROM teams WHERE teamID=?", [req.query.teamID], function(err, result){
    if (err){
      next(err);
      return;
    }
    if (result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE teams SET city=?, mascot=?, stadium=? WHERE teamID=?", [req.query.city || curVals.city, req.query.mascot || curVals.mascot, req.query.stadium || curVals.stadium, req.query.teamID], function(err, result){
        if (err){
          next(err);
          return;
        }
        mysql.pool.query('SELECT * FROM teams', function(err, rows, fields){
          if (err){
            next(err);
            return;
          }
          req.teams = rows;
          res.render('tables',{
            teams: req.teams, positionGroup: req.positionGroup, positions: req.positions, players: req.players, offensiveStats: req.offensiveStats, defensiveStats: req.defensiveStats, specialTeamsStats: req.specialTeamsStats
          });
        });
      });
    }
  });
});

//function that update positions of players
app.get('/updatePos', getTeams, getGroups, getPositions, getPlayers, getOff, getDef, getSpec, function(req, res, next){
  var context = {};
  mysql.pool.query("SELECT * FROM positions WHERE positionID=?", [req.query.positionID], function(err, result){
    if (err){
      next(err);
      return;
    }
    if (result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE positions SET position=? WHERE positionID=?", [req.query.position || curVals.position, req.query.positionID], function(err, result){
        if (err){
          next(err);
          return;
        }
        mysql.pool.query('SELECT * FROM positions', function(err, rows, fields){
          if (err){
            next(err);
            return;
          }
          req.positions = rows;
          res.render('tables',{
            teams: req.teams, positionGroup: req.positionGroup, positions: req.positions, players: req.players, offensiveStats: req.offensiveStats, defensiveStats: req.defensiveStats, specialTeamsStats: req.specialTeamsStats
          });
        });
      });
    }
  });
});

//Function to update the group positions of a team
app.get('/updateGroup', getTeams, getGroups, getPositions, getPlayers, getOff, getDef, getSpec, function(req, res, next){
  var context = {};
  mysql.pool.query("SELECT * FROM positionGroup WHERE positionGroupID=?", [req.query.positionGroupID], function(err, result){
    if (err){
      next(err);
      return;
    }
    if (result.length == 1){
      var curVals = result[0];
      mysql.pool.query("UPDATE positionGroup SET positionGroup=? WHERE positionGroupID=?", [req.query.positionGroup || curVals.positionGroup, req.query.positionGroupID], function(err, result){
        if (err){
          next(err);
          return;
        }
        mysql.pool.query('SELECT * FROM positionGroup', function(err, rows, fields){
          if (err){
            next(err);
            return;
          }
          req.positionGroup = rows;
          res.render('tables', {
            teams: req.teams, positionGroup: req.positionGroup, positions: req.positions, players: req.players, offensiveStats: req.offensiveStats, defensiveStats: req.defensiveStats, specialTeamsStats: req.specialTeamsStats
          });
        });
      });
    }
  });
});

//function that updates the players stats
app.get('/updatePlayers', getTeams, getGroups, getPositions, getPlayers, getOff, getDef, getSpec,
  function(req, res, next){
    var context = {};
    mysql.pool.query("SELECT * FROM player WHERE playerID=?", [req.query.playerID], function(err, result){
      if (err){
        next(err);
        return;
      }
      if (result.length == 1){
        var curVals = result[0];
        mysql.pool.query("UPDATE player SET firstName=?, lastName=? WHERE playerID=?", [req.query.firstName || curVals.firstName, req.query.lastName || curVals.lastName, req.query.playerID], function(err, result){
          if (err){
            next(err);
            return;
          }
          mysql.pool.query('SELECT * FROM player', function(err, rows, fields){
            if (err){
              next(err);
              return;
            }
            req.players = rows;
            res.render('tables',{
              teams: req.teams, positionGroup: req.positionGroup,   positions: req.positions, players: req.players, offensiveStats: req.offensiveStats, defensiveStats: req.defensiveStats, specialTeamsStats: req.specialTeamsStats
            });
          });
        });
      }
    });
  });

//function that updates the players offensive stats
app.get('/updateOff', getTeams, getGroups, getPositions, getPlayers, getOff, getDef, getSpec,
  function(req, res, next){
    var context = {};
    mysql.pool.query("SELECT * FROM offensiveStats WHERE offensiveStatsID=?", [req.query.offensiveStatsID], function(err, result){
      if (err){
        next(err);
        return;
      }
      if (result.length == 1){
        var curVals = result[0];
        mysql.pool.query("UPDATE offensiveStats SET passingAttempts=?, passesCompleted=?, passingYards=?, rushingYards=?, rushingAttempts=?, receptions=?, targets=?, receivingYards=? WHERE offensiveStatsID=?", [req.query.passingAttempts || curVals.passingAttempts, req.query.passesCompleted || curVals.passesCompleted, req.query.passingYards || curVals.passingYards, req.query.rushingYards || curVals.rushingYards, req.query.rushingAttempts || curVals.rushingAttempts, req.query.receptions, req.query.targets, req.query.receivingYards, req.query.offensiveStatsID], function(err, result){
          if (err){
            next(err);
            return;
          }
          mysql.pool.query('SELECT * FROM offensiveStats', function(err, rows, fields){
            if (err){
              next(err);
              return;
            }
            req.offensiveStats = rows;
            res.render('tables',{
              teams: req.teams, positionGroup: req.positionGroup, positions: req.positions, players: req.players, offensiveStats: req.offensiveStats, defensiveStats: req.defensiveStats, specialTeamsStats: req.specialTeamsStats
            });
          });
        });
      }
    });
  });

//function that updates the players defensive stats
app.get('/updateDef', getTeams, getGroups, getPositions, getPlayers, getOff, getDef, getSpec,
  function(req, res, next){
    var context = {};
    mysql.pool.query("SELECT * FROM defensiveStats WHERE defensiveStatsID=?", [req.query.defensiveStatsID], function(err, result){
      if (err){
        next(err);
        return;
      }
      if (result.length == 1){
        var curVals = result[0];
        mysql.pool.query("UPDATE defensiveStats SET sacks=?, tackles=?, forcedFumbles=?, interceptions=? WHERE defensiveStatsID=?", [req.query.sacks || curVals.sacks, req.query.tackles || curVals.tackles, req.query.forcedFumbles || curVals.forcedFumbles, req.query.interceptions || curVals.interceptions, req.query.defensiveStatsID], function(err, result){
          if (err){
            next(err);
            return;
          }
          mysql.pool.query('SELECT * FROM defensiveStats', function(err, rows, fields){
            if (err){
              next(err);
              return;
            }
            req.defensiveStats = rows;
            res.render('tables',{
              teams: req.teams, positionGroup: req.positionGroup, positions: req.positions, players: req.players, offensiveStats: req.offensiveStats, defensiveStats: req.defensiveStats, specialTeamsStats: req.specialTeamsStats
            });
          });
        });
      }
    });
  });

//function that updates the players special teams stats
app.get('/updateSpec', getTeams, getGroups, getPositions, getPlayers, getOff, getDef, getSpec,
  function(req, res, next){
    var context = {};
    mysql.pool.query("SELECT * FROM specialTeamsStats WHERE specialTeamsStatsID=?", [req.query.specialTeamsStatsID], function(err, result){
      if (err){
        next(err);
        return;
      }
      if (result.length == 1){
        var curVals = result[0];
        mysql.pool.query("UPDATE specialTeamsStats SET fieldGoalAttempts=?, fieldGoalMade=?, punts=?, averagePuntYards=? WHERE specialTeamsStatsID=?", [req.query.fieldGoalAttempts || curVals.fieldGoalAttempts, req.query.fieldGoalMade || curVals.fieldGoalMade, req.query.punts || curVals.punts, req.query.averagePuntYards || curVals.averagePuntYards, req.query.specialTeamsStatsID], function(err, result){
          if (err){
            next(err);
            return;
          }
          mysql.pool.query('SELECT * FROM specialTeamsStats', function(err, rows, fields){
            if (err){
              next(err);
              return;
            }
            req.specialTeamsStats = rows;
            res.render('tables',{
              teams: req.teams, positionGroup: req.positionGroup, positions: req.positions, players: req.players, offensiveStats: req.offensiveStats, defensiveStats: req.defensiveStats, specialTeamsStats: req.specialTeamsStats
            });
          });
        });
      }
    });
  });

//function to delete teams by ID
//how to do SQL delete
//https://www.w3schools.com/sql/sql_delete.asp
app.get('/deleteTeams', getTeams, getGroups, getPositions, getPlayers, getOff, getDef, getSpec, function(req, res, next){
  var context = {};
  mysql.pool.query("DELETE FROM teams WHERE teamID=?", [req.query.teamID], function(err, result){
    if (err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT * FROM teams', function(err, rows, fields){
      if (err){
        next(err);
        return;
      }
      req.teams = rows;
      res.render('tables',{
        teams: req.teams, positionGroup: req.positionGroup, positions: req.positions, players: req.players, offensiveStats: req.offensiveStats, defensiveStats: req.defensiveStats, specialTeamsStats: req.specialTeamsStats
      });
    });
  });
});

//function to delete groups by ID
app.get('/deleteGroup', getTeams, getGroups, getPositions, getPlayers, getOff, getDef, getSpec, function(req, res, next){
  var context = {};
  mysql.pool.query("DELETE FROM positionGroup WHERE positionGroupID=?", [req.query.positionGroupID], function(err, result){
    if (err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT * FROM positionGroup', function(err, rows, fields){
      if (err){
        next(err);
        return;
      }
      req.positionGroups = rows;
      res.render('tables',{
        teams: req.teams, positionGroup: req.positionGroup, positions: req.positions, players: req.players, offensiveStats: req.offensiveStats, defensiveStats: req.defensiveStats, specialTeamsStats: req.specialTeamsStats
      });
    });
  });
});

//function to delete psoitions by ID
app.get('/deletePos', getTeams, getGroups, getPositions, getPlayers, getOff, getDef, getSpec, function(req, res, next){
  var context = {};
  mysql.pool.query("DELETE FROM positions WHERE positionID=?", [req.query.positionID], function(err, result){
    if (err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT * FROM positions', function(err, rows, fields){
      if (err){
        next(err);
        return;
      }
      req.positions = rows;
      res.render('tables',{
        teams: req.teams, positionGroup: req.positionGroup, positions: req.positions, players: req.players, offensiveStats: req.offensiveStats, defensiveStats: req.defensiveStats, specialTeamsStats: req.specialTeamsStats
      });
    });
  });
});

//function to delete player by ID
app.get('/deletePlayers', getTeams, getGroups, getPositions, getPlayers, getOff, getDef, getSpec, function(req, res, next){
  var context = {};
  mysql.pool.query("DELETE FROM player WHERE playerID=?", [req.query.playerID], function(err, result){
    if (err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT * FROM player', function(err, rows, fields){
      if (err){
        next(err);
        return;
      }
      req.players = rows;
      res.render('tables',{
        teams: req.teams, positionGroup: req.positionGroup, positions: req.positions, players: req.players, offensiveStats: req.offensiveStats, defensiveStats: req.defensiveStats, specialTeamsStats: req.specialTeamsStats
      });
    });
  });
});

//function to delete offensive stats by ID
app.get('/deleteOff', getTeams, getGroups, getPositions, getPlayers, getOff, getDef, getSpec, function(req, res, next){
  var context = {};
  mysql.pool.query("DELETE FROM offensiveStats WHERE offensiveStatsID=?", [req.query.offensiveStatsID], function(err, result){
    if (err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT * FROM offensiveStats', function(err, rows, fields){
      if (err){
        next(err);
        return;
      }
      req.offensiveStats = rows;
      res.render('tables',{
        teams: req.teams, positionGroup: req.positionGroup, positions: req.positions, players: req.players, offensiveStats: req.offensiveStats, defensiveStats: req.defensiveStats, specialTeamsStats: req.specialTeamsStats
      });
    });
  });
});

//function to delete defensive stats by ID
app.get('/deleteDef', getTeams, getGroups, getPositions, getPlayers, getOff, getDef, getSpec, function(req, res, next){
  var context = {};
  mysql.pool.query("DELETE FROM defensiveStats WHERE defensiveStatsID=?", [req.query.defensiveStatsID], function(err, result){
    if (err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT * FROM defensiveStats', function(err, rows, fields){
      if (err){
        next(err);
        return;
      }
      req.defensiveStats = rows;
      res.render('tables',{
        teams: req.teams, positionGroup: req.positionGroup, positions: req.positions, players: req.players, offensiveStats: req.offensiveStats, defensiveStats: req.defensiveStats, specialTeamsStats: req.specialTeamsStats
      });
    });
  });
});

//specialTeamsStats Delete
app.get('/deleteSpec', getTeams, getGroups, getPositions, getPlayers, getOff, getDef, getSpec, function(req, res, next){
  var context = {};
  mysql.pool.query("DELETE FROM specialTeamsStats WHERE specialTeamsStatsID=?", [req.query.specialTeamsStatsID], function(err, result){
    if (err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT * FROM specialTeamsStats', function(err, rows, fields){
      if (err){
        next(err);
        return;
      }
      req.specialTeamsStats = rows;
      res.render('tables',{
        teams: req.teams, positionGroup: req.positionGroup, positions: req.positions, players: req.players, offensiveStats: req.offensiveStats, defensiveStats: req.defensiveStats, specialTeamsStats: req.specialTeamsStats
      });
    });
  });
});

//Search function that grabs the teams, positions or groups
app.use('/search', getTeams, getPositions, getGroups, function(req, res){
  res.render('search',{
    teams: req.teams, positions: req.positions, positionGroup: req.positionGroup
  });
});

//Search by Team Page
//SQL how to do joins 
//https://www.w3schools.com/sql/sql_join.asp
app.get('/searchTeam', getTeams, getPlayers, getPositions, getGroups, function(req, res, next){
  mysql.pool.query("SELECT player.pNumber, player.firstName, player.lastName, teams.mascot, positions.position FROM player JOIN positions on player.position = positions.positionID JOIN teams ON player.team = teams.teamID WHERE teams.teamID=?", [req.query.teamID], function(err, rows, fields){
    if (err){
      next(err);
      return;
    }
    req.players = rows;
    res.render('search',{
      players: req.players, teams: req.teams, positions: req.positions, positionGroup: req.positionGroup
    });
  });
});

//Search by position
app.get('/searchPos', getTeams, getPlayers, getPositions, getGroups, function(req, res, next){
  mysql.pool.query("SELECT player.pNumber, player.firstName, player.lastName, teams.mascot, positions.position FROM player JOIN positions on player.position = positions.positionID JOIN teams ON player.team = teams.teamID WHERE positions.positionID=?", [req.query.positionID], function(err, rows, fields){
    if (err){
      next(err);
      return;
    }
    req.players = rows;
    res.render('search',{
      players: req.players, teams: req.teams, positions: req.positions, positionGroup: req.positionGroup
    });
  });
});


//create the stats page
function renderStatsPage(req, res){
  res.render('stats',{
    quarterbackStats: req.quarterbackStats, rushingStats: req.rushingStats,receivingStats: req.receivingStats,tackles: req.tackles,kicking: req.kicking
  });
}

//Function that starts the homepage
app.get('/', function(req, res){
  res.render('tables');
})

//404 Page
app.use(function(req, res){
  res.status(404);
  res.render('404');
});

//500 Page
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

//console command to show where it was hosted
app.listen(app.get('port'), function(){
  console.log('Express started on http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
