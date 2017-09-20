const express = require('express');

const router = express.Router();
const config = require('./config');
const bitcoin = require('bitcoin');

'use strict';

// Bitcoin client
const client = new bitcoin.Client(config.credentials);

/*
  Get info
  curl http://localhost:9000/api/bitcoin/getinfo -s | jq
*/
router.get('/getinfo', (req, res) => {
	client.getInfo((err, result, resHeaders) => {
		return res.status(200).send({err, result, resHeaders});
	});
});

/*
  Get balance
  $ curl http://localhost:9000/api/bitcoin/getconfirmedbalance -s | jq
*/
router.get('/getconfirmedbalance', (req, res) => {
	client.getBalance((err, result, resHeaders) => {
		return res.status(200).send({err, result, resHeaders});
	});
});

/*
  Get unconfirmed balance
  $ curl http://localhost:9000/api/bitcoin/getunconfirmedbalance -s | jq
*/
router.get('/getunconfirmedbalance', (req, res) => {
	client.getUnconfirmedBalance((err, result, resHeaders) => {
		return res.status(200).send({err, result, resHeaders});
	});
});

/*
  Generate new address
  $ curl http://localhost:9000/api/bitcoin/getnewaddress -s | jq
*/
router.get('/getnewaddress', (req, res) => {
	client.getNewAddress((err, result, resHeaders) => {
		return res.status(200).send({err, result, resHeaders});
	});
});

/*
 Get block height
 $ curl http://localhost:9000/api/bitcoin/getblockcount -s | jq
*/
router.get('/getblockcount', (req, res) => {
	client.cmd('getblockcount', (err, result, resHeaders) => {
		return res.status(200).send({err, result, resHeaders});
	});
});

/*
	Mine 6 blocks
	$ curl http://localhost:9000/api/bitcoin/generate -s | jq
*/
router.post('/generate', (req, res) => {
	client.cmd('generate', req.body.blocks, err => {
		if (!err) {
			console.log('Mined 6 blocks');
			res.send({status: 'OK'});
		}

		throw err;
	});
});

/*
  Send xbt to address
  curl http://localhost:9000/api/bitcoin/sendtoaddress -X POST -d '{"bitcoinaddress":"2N2mthmX52u4pBmP2VQKpLncizxthCWEtnr", "amount":"0.01"}' -H 'Content-Type: application/json' | jq
*/
router.post('/sendtoaddress', (req, res) => {
    /*
    Var cmd = "sendtoaddress "+req.body.address+" "+req.body.amount
  runCMD("bitcoin-cli -testnet",cmd, function(error, stdout, stderr){
    return res.status(200).send({ err: error, result: stdout, resHeaders: null });
  })
    */
	client.sendToAddress(req.body.address, req.body.amount, (err, result, resHeaders) => {
		if ((err !== null) && (typeof (err) !== 'undefined')) {
			return res.status(400).send({err});
		}
		return res.status(200).send({err, result, resHeaders});
	});
});

/*
  Get raw transaction
  $ curl http://localhost:9000/api/bitcoin/getrawtransaction -X POST -d '{"txid":"4749134d37f0b793b502b026d44aa206c1b5a39404898d7d326c94a4db69ba5a"}' -H 'Content-Type: application/json' | jq
*/
router.post('/getrawtransaction', (req, res) => {
    /*
    Var cmd = "getrawtransaction "+req.body.txid
  runCMD("bitcoin-cli -testnet",cmd, function(error, stdout, stderr){
    return res.status(200).send({ err: error, result: stdout, resHeaders: null });
  })
    */
	client.getRawTransaction(req.body.txid, (err, result, resHeaders) => {
		if ((err !== null) && (typeof (err) !== 'undefined')) {
			return res.status(400).send({err});
		}
		return res.status(200).send({err, result, resHeaders});
	});
});

module.exports = router;
