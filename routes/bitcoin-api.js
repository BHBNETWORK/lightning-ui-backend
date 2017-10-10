'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const bitcoin = require('bitcoin');

const config = require('../config');

// Bitcoin client
const client = new bitcoin.Client(config.credentials);

/*
  Get info
  curl http://localhost:9000/api/bitcoin/getinfo -s | jq
*/
router.get('/getinfo', (req, res) => {
	client.getInfo((err, result) => {
		if (err) {
			return res.status(400).send({error: err});
		}

		res.send(result);
	});
});

/*
  Get balance
  $ curl http://localhost:9000/api/bitcoin/getconfirmedbalance -s | jq
*/
router.get('/getconfirmedbalance', (req, res) => {
	client.getBalance((err, result) => {
		if (err) {
			return res.status(400).send({error: err});
		}

		res.send({balance: result});
	});
});

/*
  Get unconfirmed balance
  $ curl http://localhost:9000/api/bitcoin/getunconfirmedbalance -s | jq
*/
router.get('/getunconfirmedbalance', (req, res) => {
	client.getUnconfirmedBalance((err, result) => {
		if (err) {
			return res.status(400).send({error: err});
		}

		res.send({balance: result});
	});
});

/*
  Generate new address
  $ curl http://localhost:9000/api/bitcoin/getnewaddress -s | jq
*/
router.get('/getnewaddress', (req, res) => {
	client.getNewAddress((err, result) => {
		if (err) {
			return res.status(400).send({error: err});
		}

		res.send({address: result});
	});
});

/*
 Get block height
 $ curl http://localhost:9000/api/bitcoin/getblockcount -s | jq
*/
router.get('/getblockcount', (req, res) => {
	client.cmd('getblockcount', (err, result) => {
		if (err) {
			return res.status(400).send({error: err});
		}

		res.send({count: result});
	});
});

/*
	Mine 6 blocks
	$ curl http://localhost:9000/api/bitcoin/generate -s | jq
*/
router.post('/generate', (req, res) => {
	if (!req.body.blocks) {
		return res.status(400).send({error: 'missing_blocks_num'});
	}

	client.cmd('generate', parseInt(req.body.blocks, 10), err => {
		if (!err) {
			console.log(`Mined ${req.body.blocks} blocks`);
			res.send({status: 'OK'});
			return;
		}

		return res.status(400).send({error: err});
	});
});

/*
  Send xbt to address
  curl http://localhost:9000/api/bitcoin/sendtoaddress -X POST -d '{"address":"2N2mthmX52u4pBmP2VQKpLncizxthCWEtnr", "amount":"0.01"}' -H 'Content-Type: application/json' | jq
*/
router.post('/sendtoaddress', (req, res) => {
	client.sendToAddress(req.body.address, req.body.amount, (err, result) => {
		if (err) {
			return res.status(400).send({error: err});
		}

		res.send({txid: result});
	});
});

/*
  Get raw transaction
  $ curl http://localhost:9000/api/bitcoin/getrawtransaction -X POST -d '{"txid":"4749134d37f0b793b502b026d44aa206c1b5a39404898d7d326c94a4db69ba5a"}' -H 'Content-Type: application/json' | jq
*/
router.get('/getrawtransaction/:txid', (req, res) => {
	client.getRawTransaction(req.params.txid, (err, result) => {
		if (err) {
			return res.status(400).send({error: err});
		}

		res.send({rawtx: result});
	});
});

module.exports = router;
