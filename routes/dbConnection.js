var connection = null;
var credentials = require("../credentials.js");

module.exports.dbConnect  = 
	function (){
	 if (connection == null) {
    connection = require('mysql').createConnection({
        "host": "52.72.17.21", "port": 3306,
				"user": credentials.username,
				"password": credentials.password,
				"database": "673project"
    });
   }
   return connection;
	};


