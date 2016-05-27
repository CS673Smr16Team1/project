
module.exports =
    function displaySampleData(req, res) {
    var data = [
        {name: 'bob', age: 20},
        {name: 'sarah', age:30},
        {name: 'billy', age:40}
    ];
        res.render('sampleDataView', {title: 'Project - Sample Data',
            sampleDataSelected: 'pure-menu-selected', myData: data});
    };


