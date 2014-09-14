var Interfake = require('interfake');
var i = new Interfake({ path : '/api' });
i.serveStatic('/', './');
i.listen(3000);