var connection = 
  require('./dbConnection.js').dbConnect();

module.exports = 
  function saveCar(req , res , next){
    var id = req.params.id;
    var inputFromForm = {
      car  : req.body.cname,
      color    : req.body.ccolor
    };
    
    connection.query("UPDATE sample set ? WHERE idsample=?",
      [inputFromForm, id], 
      function(err, rows) {
        if (err)
            console.log("Error inserting : %s ",err );
        res.redirect('/sample-data');
    });
  };
