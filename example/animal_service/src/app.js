var service = (function() {

    require('colors');
    var app = require('express')();

    var db = {
        findAnimal: function(name) {
            return this[name];
        }
    };

    app.get('/alligators/:name', function (req, res) {
        try {
            var name = req.params.name;
            var animal = db.findAnimal(name);

            if (!animal) {
                res.status(404).send();
            } else if (animal.public === false) {
                res.status(403).send();
            } else {
                res.send(animal);
            }
        } catch(err) {
            res.status(500).send(err);
        }
    });

    function start() {
        app.set('port', (process.env.PORT || 3002));
        app.listen(app.get('port'), function () {
            console.log('Listening on port ' + app.get('port'));
        });
    }

    return {
        start: start,
        app: app,
        db: db
    };
})();


if(process.argv.indexOf('start') > 0) {
    service.db['Mary'] = { name:'Mary', comments:'Mild temperament', public:true };
    service.db['Godzilla'] = { name:'Godzilla', comments:'Extremely large, aggressive', public:true };
    service.db['David Boon'] = { name:'David Boon', comments:'Has moustache', public:true };
    service.db['Henry'] = { name:'Henry', comments:'Possibly a crocodile', public:false };
    service.start();
}

module.exports = service;