'use strict';

const router = require('express-promise-router')();
const config = require('./config');

const LightningClient = require('./lightning-client');

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
  curl http://localhost:9000/api/lightning/getpeers -s | jq
*/
router.get('/getpeers', (req, res) => {
	return client.getpeers()
        .then(result => res.send(result));
});

/*
  Get nodes
  curl http://localhost:9000/api/lightning/getnodes -s | jq
*/
router.get('/getnodes', (req, res) => {
	return client.getnodes()
        .then(result => res.send(result));
});

/*
  Get channels
  curl http://localhost:9000/api/lightning/getchannels -s | jq
*/
router.get('/getchannels', (req, res) => {
	return client.getchannels()
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
  Close a channel
  curl -X POST -H 'Content-Type: application/json' -d '{"nodeid":""}' http://localhost:9000/api/lightning/closechannel -s | jq
*/
router.post('/closechannel', (req, res) => {
	return client.close(req.body.nodeid)
        .then(result => res.send(result));
});

/*
  Get route
  curl -X POST -H 'Content-Type: application/json' -d '{"nodeid":"","amount":"","riskfactor":""}' http://localhost:9000/api/lightning/getroute -s | jq
*/
router.post('/getroute', (req, res) => {
	return client.getroute(req.body.nodeid, req.body.amount, req.body.riskfactor)
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
router.get('/listinvoice', (req, res) => {
	return client.listinvoice()
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

