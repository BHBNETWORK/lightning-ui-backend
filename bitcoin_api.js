const express = require('express');
const router = express.Router();
const config = require('./config');
const bitcoin = require('bitcoin');

"use strict";

// Bitcoin client
const client = new bitcoin.Client(config.credentials);

/*
  get info
  curl http://localhost:9000/api/bitcoin/getinfo -s | jq
*/
router.get('/getinfo', function (req, res) {
    client.getInfo(function (err, result, resHeaders) {
        return res.status(200).send({err: err, result: result, resHeaders: resHeaders});
    });
});

/*
  get balance
  $ curl http://localhost:9000/api/bitcoin/getconfirmedbalance -s | jq
*/
router.get('/getconfirmedbalance', function (req, res) {
    client.getBalance(function (err, result, resHeaders) {
        return res.status(200).send({err: err, result: result, resHeaders: resHeaders});
    });
});

/*
  get unconfirmed balance
  $ curl http://localhost:9000/api/bitcoin/getunconfirmedbalance -s | jq
*/
router.get('/getunconfirmedbalance', function (req, res) {
    client.getUnconfirmedBalance(function (err, result, resHeaders) {
        return res.status(200).send({err: err, result: result, resHeaders: resHeaders});
    });
});

/*
  generate new address
  $ curl http://localhost:9000/api/bitcoin/getnewaddress -s | jq
*/
router.get('/getnewaddress', function (req, res) {
    client.getNewAddress(function (err, result, resHeaders) {
        return res.status(200).send({err: err, result: result, resHeaders: resHeaders});
    });
});

/*
 get block height
 $ curl http://localhost:9000/api/bitcoin/getblockcount -s | jq
*/
router.get('/getblockcount', function (req, res) {
    client.cmd('getblockcount', function (err, result, resHeaders) {
        return res.status(200).send({err: err, result: result, resHeaders: resHeaders});
    });
});

/*
	mine 6 blocks
	$ curl http://localhost:9000/api/bitcoin/generate -s | jq
*/
router.post('/generate', function (req, res) {
    client.cmd('generate', req.body.blocks, function (err) {
        if (!err) {
            console.log("Mined 6 blocks");
            res.send({status: 'OK'});
        }

        throw err;
    });
});

/*
  send xbt to address
  curl http://localhost:9000/api/bitcoin/sendtoaddress -X POST -d '{"bitcoinaddress":"2N2mthmX52u4pBmP2VQKpLncizxthCWEtnr", "amount":"0.01"}' -H 'Content-Type: application/json' | jq
*/
router.post('/sendtoaddress', function (req, res) {
    /*
    var cmd = "sendtoaddress "+req.body.address+" "+req.body.amount
  runCMD("bitcoin-cli -testnet",cmd, function(error, stdout, stderr){
    return res.status(200).send({ err: error, result: stdout, resHeaders: null });
  })
    */
    client.sendToAddress(req.body.address, req.body.amount, function (err, result, resHeaders) {
        if ((null !== err) && ("undefined" !== typeof (err))) {
            return res.status(400).send({err: err});
        }
        else {
            return res.status(200).send({err: err, result: result, resHeaders: resHeaders});
        }
    });
});

/*
  get raw transaction
  $ curl http://localhost:9000/api/bitcoin/getrawtransaction -X POST -d '{"txid":"4749134d37f0b793b502b026d44aa206c1b5a39404898d7d326c94a4db69ba5a"}' -H 'Content-Type: application/json' | jq
*/
router.post('/getrawtransaction', function (req, res) {
    /*
    var cmd = "getrawtransaction "+req.body.txid
  runCMD("bitcoin-cli -testnet",cmd, function(error, stdout, stderr){
    return res.status(200).send({ err: error, result: stdout, resHeaders: null });
  })
    */
    client.getRawTransaction(req.body.txid, function (err, result, resHeaders) {
        if ((null !== err) && ("undefined" !== typeof (err))) {
            return res.status(400).send({err: err});
        }
        else {
            return res.status(200).send({err: err, result: result, resHeaders: resHeaders});
        }
    });
});

module.exports = router;
