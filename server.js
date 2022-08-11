var express = require('express');
var app = express();

app.use(express.static('./docs/'));

var port = process.argv[2] || 8088;
app.listen(port);

console.log("App starting on " + port);