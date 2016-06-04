module.exports = 
	function addCar(req , res , next){
  	res.render('addCarView',
  		{title:"Add a Car",
			sampleDataSelected: 'pure-menu-selected'});
};
