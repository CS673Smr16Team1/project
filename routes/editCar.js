var connection = 
	require('./dbConnection.js').dbConnect();

module.exports = 
	function editCar(req , res , next){
    var id = req.params.id;
    connection.query('SELECT * FROM sample WHERE idsample = ?',
      [id],
    	function(err,rows){
    		if(err)
        	console.log("Error Selecting : %s ", err);      	
    		res.render('editCarView',
    			{title:"Edit Car", data:rows[0],
					sampleDataSelected: 'pure-menu-selected'});
		});
};

