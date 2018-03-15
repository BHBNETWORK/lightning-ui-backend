'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const ps = require('ps-node');
const _ = require('lodash');

const LightningError = require('./lightning-error');

const app = express();

app.set('env', process.env.NODE_ENV || 'development');

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

// Check if Lightning is running.
ps.lookup({
	command: 'lightningd',
	psargs: 'ux'
}, (err, resultList) => {
	if (err) {
		throw new Error(err);
	}

	if (resultList.length === 0) {
		console.log('Lightningd is not running.');
	}

	resultList.forEach(process => {
		if (process) {
			console.log('PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments);
		}
	});
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(morgan('common'));
app.use('/api/lightning', require('./routes/lightning-api'));
app.use('/api/settings', require('./routes/settings-api'));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	if (_.isError(err) && !(err instanceof LightningError)) {
		let error = 'server_error';

		if (req.app.get('env') === 'development') {
			error = {
				message: err.toString(),
				stackTrace: err.stack
			};
		}

		res.status(500).send({error});
		return;
	}
	if (err instanceof LightningError) {
		err = err.message;
	}

	res.status(400).send({error: err});
});

app.use((req, res) => {
	return res.status(404).send('404: Not found');
});

app.listen(process.env.PORT || 9000, () => {
	console.log(`Listening on port ${process.env.PORT || 9000}`);
});
