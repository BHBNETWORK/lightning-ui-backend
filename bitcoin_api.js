'use strict';

const express = require('express');
const router = express.Router();
const config = require('./config');
const bitcoin = require('bitcoin');

// Bitcoin client
const client = new bitcoin.Client(config.credentials);

/*
  get info
  curl http://localhost:9000/api/bitcoin/getinfo -s | jq
*/
router.get('/getinfo', function (req, res) {
    client.getInfo(function (err, result) {
        if (err) {
            return res.status(400).send({error: err});
        }

        res.send(result);
    });
});

/*
  get balance
  $ curl http://localhost:9000/api/bitcoin/getconfirmedbalance -s | jq
*/
router.get('/getconfirmedbalance', function (req, res) {
    client.getBalance(function (err, result) {
        if (err) {
            return res.status(400).send({error: err});
        }

        res.send({balance: result});
    });
});

/*
  get unconfirmed balance
  $ curl http://localhost:9000/api/bitcoin/getunconfirmedbalance -s | jq
*/
router.get('/getunconfirmedbalance', function (req, res) {
    client.getUnconfirmedBalance(function (err, result) {
        if (err) {
            return res.status(400).send({error: err});
        }

        res.send({balance: result});
    });
});

/*
  generate new address
  $ curl http://localhost:9000/api/bitcoin/getnewaddress -s | jq
*/
router.get('/getnewaddress', function (req, res) {
    client.getNewAddress(function (err, result) {
        if (err) {
            return res.status(400).send({error: err});
        }

        res.send({address: result});
    });
});

/*
 get block height
 $ curl http://localhost:9000/api/bitcoin/getblockcount -s | jq
*/
router.get('/getblockcount', function (req, res) {
    client.cmd('getblockcount', function (err, result) {
        if (err) {
            return res.status(400).send({error: err});
        }

        res.send({count: result});
    });
});

/*
	mine 6 blocks
	$ curl http://localhost:9000/api/bitcoin/generate -s | jq
*/
router.post('/generate', function (req, res) {
    if (!req.body.blocks) {
        return res.status(400).send({error: 'missing_blocks_num'});
    }

    client.cmd('generate', parseInt(req.body.blocks), function (err) {
        if (!err) {
            console.log(`Mined ${req.body.blocks} blocks`);
            res.send({status: 'OK'});
            return;
        }

        return res.status(400).send({error: err});
    });
});

/*
  send xbt to address
  curl http://localhost:9000/api/bitcoin/sendtoaddress -X POST -d '{"address":"2N2mthmX52u4pBmP2VQKpLncizxthCWEtnr", "amount":"0.01"}' -H 'Content-Type: application/json' | jq
*/
router.post('/sendtoaddress', function (req, res) {
    client.sendToAddress(req.body.address, req.body.amount, function (err, result) {
        if (err) {
            return res.status(400).send({error: err});
        }

        res.send({txid: result});
    });
});

/*
  get raw transaction
  $ curl http://localhost:9000/api/bitcoin/getrawtransaction -X POST -d '{"txid":"4749134d37f0b793b502b026d44aa206c1b5a39404898d7d326c94a4db69ba5a"}' -H 'Content-Type: application/json' | jq
*/
router.get('/getrawtransaction/:txid', function (req, res) {
    client.getRawTransaction(req.params.txid, function (err, result) {
        if (err) {
            return res.status(400).send({error: err});
        }

        res.send({rawtx: result});
    });
});

module.exports = router;
