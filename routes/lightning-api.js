'use strict';

const router = require('express-promise-router')();
const LightningClient = require('lightning-client');

const config = require('../config');

const client = new LightningClient(config.lightningRoot);
/*
  Get node info
  curl http://localhost:9000/api/lightning/getinfo -s | jq
*/
router.get('/getinfo', (req, res) => {
	return client.getinfo()
        .then(result => res.send(result));
});

/*
  Get peers
  curl http://localhost:9000/api/lightning/listpeers -s | jq
*/
router.get('/listpeers', (req, res) => {
	return client.listpeers()
        .then(result => res.send(result));
});

/*
  Get nodes
  curl http://localhost:9000/api/lightning/listnodes -s | jq
*/
router.get('/listnodes', (req, res) => {
	return client.listnodes()
        .then(result => res.send(result));
});

/*
  Get channels
  curl http://localhost:9000/api/lightning/listchannels -s | jq
*/
router.get('/listchannels', (req, res) => {
	return client.listchannels()
        .then(result => res.send(result));
});

/*
  New address
  curl http://localhost:9000/api/lightning/getnewaddress -s | jq
*/
router.get('/getnewaddress', (req, res) => {
	return client.newaddr()
        .then(result => res.send(result));
});

/*
  Open a channel
  curl -X POST -H 'Content-Type: application/json' -d '{"ip":"localhost","port":"8899","nodeid":"<nodeid>","amount":10000}' http://localhost:9000/api/lightning/openchannel -s | jq
*/
router.post('/openchannel', (req, res) => {
	return client.connect(req.body.ip, req.body.port, req.body.nodeid)
        .then(() => client.fundchannel(req.body.nodeid, req.body.amount))
        .then(result => res.send(result));
});

/*
  Add funds
  curl -X POST -H 'Content-Type: application/json' -d '{"rawtx":"<raw transaction hex>"}' http://localhost:9000/api/lightning/addfunds -s | jq
*/
router.post('/addfunds', (req, res) => {
	return client.addfunds(req.body.rawtx)
        .then(result => res.send(result));
});

/*
  Move funds into a channel
  curl -X POST -H 'Content-Type: application/json' -d '{"nodeid":"<node id>", "amount": 1000}' http://localhost:9000/api/lightning/fundchannel -s | jq
*/
router.post('/fundchannel', (req, res) => {
	return client.fundchannel(req.body.nodeid, req.body.amount)
        .then(result => res.send(result));
});

/*
  Connect to a node
  curl -X POST -H 'Content-Type: application/json' -d '{"ip":"localhost","port":"8899","nodeid":"<nodeid>"}' http://localhost:9000/api/lightning/connect -s | jq
*/
router.post('/connect', (req, res) => {
	return client.connect(req.body.ip, req.body.port, req.body.nodeid)
        .then(result => res.send(result));
});

/*
  List the available funds
  curl http://localhost:9000/api/lightning/listfunds -s | jq
*/
router.get('/listfunds', (req, res) => {
	return client.listfunds()
        .then(result => res.send(result));
});

/*
  Close a channel
  curl -X POST -H 'Content-Type: application/json' -d '{"nodeid":""}' http://localhost:9000/api/lightning/closechannel -s | jq
*/
router.post('/closechannel', (req, res) => {
	return client.close(req.body.nodeid)
        .then(result => res.send(result));
});

/*
  Get route
  curl -X POST -H 'Content-Type: application/json' -d '{"nodeid":"","amount":"","riskFactor":""}' http://localhost:9000/api/lightning/getroute -s | jq
*/
router.post('/getroute', (req, res) => {
	return client.getroute(req.body.nodeid, req.body.amount, req.body.riskFactor)
        .then(result => res.send(result));
});

/*
  Create invoice
  curl -X POST -H 'Content-Type: application/json' -d '{"label":"Invoice # 1"}' http://localhost:9000/api/lightning/invoice -s | jq
*/
router.post('/createinvoice', (req, res) => {
	return client.invoice(req.body.amount, req.body.label)
        .then(result => res.send(result));
});

/*
  List invoice
  curl http://localhost:9000/api/lightning/listinvoice -s | jq
*/
router.get('/listinvoices', (req, res) => {
	return client.listinvoices()
        .then(result => res.send(result));
});

/*
  Delete an invoice
  curl -S DELETE http://localhost:9000/api/lightning/invoice -s | jq
*/
router.delete('/invoice/:label', (req, res) => {
	return client.delinvoice(req.params.label)
        .then(result => res.send(result));
});

/*
  Withdraw
  curl -S DELETE http://localhost:9000/api/lightning/invoice -s | jq
*/
router.post('/withdraw', (req, res) => {
	return client.withdraw(req.body.address, req.body.amount)
        .then(result => res.send(result));
});

/*
  Send pay
  curl -X POST -H 'Content-Type: application/json' -d '{"route":[...],"hash":""}' http://localhost:9000/api/lightning/sendpay -s | jq
*/
router.post('/sendpay', (req, res) => {
	console.log(req.body.route, req.body.hash);
	return client.sendpay(req.body.route, req.body.hash)
        .then(result => res.send(result));
});

module.exports = router;

