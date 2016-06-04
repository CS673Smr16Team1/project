var connection = 
  require('./dbConnection.js').dbConnect();

module.exports = 
  function saveCar(req , res , next){
    
    var inputFromForm = {
      car  : req.body.cname,
      color    : req.body.ccolor
    };
    connection.query("INSERT INTO sample set ? ",
      inputFromForm, 
      function(err, rows)
      {
        if (err)
          console.log("Error inserting : %s ",err );
        res.redirect('/sample-data');
      });
  };
