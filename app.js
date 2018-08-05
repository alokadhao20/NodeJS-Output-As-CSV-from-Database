var express = require('express'),
	routes = require('./routes'),
	user = require('./routes/user'),
	http = require('http'),
	path = require('path'),
	fs = require('fs'),
	mime = require('mime');
var app = express();

//all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

var csv = require('csv-stream');
var request = require('request');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'test'
});

app.get('/', function (req, res) {
	//connection.connect();
	var file = connection.query('SELECT * FROM test.TestDemo', function (err, rows, fields) {
		if (err) throw err;
		for (var i = 0; i < rows.length; i++) {
			var body = '';
			body = rows[i].id + ',' + rows[i].Name + ',' + rows[i].Branch + ',' + rows[i].Dob + "\n";
			fs.appendFile(__dirname + '/public/result.csv', body);
		}
		var file = __dirname + '/public/result.csv';
		var filename = path.basename(file);
		var mimetype = mime.lookup(file);
		res.setHeader('Content-disposition', 'attachment;filename=' + filename);
		res.setHeader('Content-type', mimetype);
		var filestream = fs.createReadStream(file);
		filestream.pipe(res);
		//connection.end();
	});
});

http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});