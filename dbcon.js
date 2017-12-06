//CS340 Brandon Lo external mysql config file

//how to use an external config for mysql 
//https://www.npmjs.com/package/mysql-connection-pool
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : ' ',
  password        : ' ',
  database        : 'cs340_lob',
  dateStrings     : true
});

module.exports.pool = pool;
