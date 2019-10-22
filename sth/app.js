#! /usr/bin/node

const express = require('express');
const http = require('http');
const config = require('./config');

var app = express();
var router = express.Router();
router.get('/*', function (req, res) {
	console.log(`GET ${req.originalUrl}`);
	http.get({
		'host': config.host,
		'path': req.originalUrl,
		'port': config.port,
		'headers': {
			'Cookie': `connect.sid=${config.connect_sid}`
		}
	}, function (resp) {
		var body = [];
		resp.on('data', function (chunk) { body.push(chunk); });
		resp.on('end', function () {
			body = Buffer.concat(body);
			console.log(resp.statusCode);
			if (resp.statusCode == 302)
				res.redirect(resp.headers["location"]);
			else {
				res.header(resp.headers);
				res.send(body);
			}
		});
	});
});

app.use('/*', router);
app.listen(28762);