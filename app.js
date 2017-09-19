'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const ps = require('ps-node');
const _ = require("lodash");

const app = express();

app.set('env', process.env.NODE_ENV || 'development');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Check if Lightning is running.
ps.lookup({
    command: 'lightningd',
    psargs: 'ux'
}, function (err, resultList) {
    if (err) {
        throw new Error(err);
    }

    if (resultList.length < 1) {
        console.log('Lightningd is not running.');
    }

    resultList.forEach(function (process) {
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
app.use('/api/bitcoin', require('./bitcoin_api'));
app.use('/api/lightning', require('./lightning_api'));

app.use((err, req, res, next) => {
    if (_.isError(err)) {
        let error = 'server_error';

        if (req.app.get('env') === 'development') {
            error = {
                message: err.toString(),
                stackTrace: err.stack
            }
        }

        res.status(500).send({error});
        return;
    }

    res.status(400).send({error: err});
});

app.use((req, res) => {
    return res.status(404).send('404: Not found');
});

app.listen(process.env.PORT || 9000, () => {
    console.log(`Listening on port ${process.env.PORT || 9000}`);
});
