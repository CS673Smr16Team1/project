var connection = 
	require('./dbConnection.js').dbConnect();

module.exports = 
	function deleteCar(req , res , next){
    var id = req.params.id;
    connection.query("DELETE FROM sample WHERE idsample = ? ",
      [id], 
    	function(err, rows)
      {
  		  if(err)
              console.log("Error deleting : %s ", err );
        res.redirect('/sample-data');
      });
  };

  