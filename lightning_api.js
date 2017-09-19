'use strict';

const router = require('express-promise-router')();
const config = require("./config");

const LightningClient = require('./lightning_client');

const client = new LightningClient(config.lightningRoot);
/*
  get node info
  curl http://localhost:9000/api/lightning/getinfo -s | jq
*/
router.get('/getinfo', (req, res) => {
    return client.getinfo()
        .then(result => res.send(result));
});

/*
  get peers
  curl http://localhost:9000/api/lightning/getpeers -s | jq
*/
router.get('/getpeers', (req, res) => {
    return client.getpeers()
        .then(result => res.send(result));
});

/*
  get nodes
  curl http://localhost:9000/api/lightning/getnodes -s | jq
*/
router.get('/getnodes', (req, res) => {
    return client.getnodes()
        .then(result => res.send(result));
});

/*
  get channels
  curl http://localhost:9000/api/lightning/getchannels -s | jq
*/
router.get('/getchannels', (req, res) => {
    return client.getchannels()
        .then(result => res.send(result));
});

/*
  new address
  curl http://localhost:9000/api/lightning/getnewaddress -s | jq
*/
router.get('/getnewaddress', (req, res) => {
    return client.newaddr()
        .then(result => res.send(result));
});

/*
  open a channel
  curl -X POST -H 'Content-Type: application/json' -d '{"ip":"localhost","port":"8899","rawtx":"copy from get raw transcation"}' http://localhost:9000/api/lightning/openchannel -s | jq
*/
router.post('/openchannel', (req, res) => {
    return client.connect(req.body.ip, req.body.port, req.body.nodeid)
        .then(() => client.fundchannel(req.body.nodeid, req.body.amount))
        .then(result => res.send(result));
});

/*
  close a channel
  curl -X POST -H 'Content-Type: application/json' -d '{"node":"node string"}' http://localhost:9000/api/lightning/closechannel -s | jq
*/
router.post('/closechannel', (req, res) => {
    return client.close(req.body.node)
        .then(result => res.send(result));
});

/*
  get route
  curl -X POST -H 'Content-Type: application/json' -d '{"nodeId":"","amount":"","riskfactor":""}' http://localhost:9000/api/lightning/getroute -s | jq
*/
router.post('/getroute', (req, res) => {
    return client.getroute(req.body.nodeId, req.body.amount, req.body.riskfactor)
        .then(result => res.send(result));
});

/*
  create invoice
  curl -X POST -H 'Content-Type: application/json' -d '{"label":"Invoice # 1"}' http://localhost:9000/api/lightning/invoice -s | jq
*/
router.post('/createinvoice', (req, res) => {
    return client.invoice(req.body.amount, req.body.label)
        .then(result => res.send(result));
});

/*
  list invoice
  curl http://localhost:9000/api/lightning/listinvoice -s | jq
*/
router.get('/listinvoice', (req, res) => {
    return client.listinvoice()
        .then(result => res.send(result));
});

/*
  send pay
  curl -X POST -H 'Content-Type: application/json' -d '{"route":"","hash":""}' http://localhost:9000/api/lightning/sendpay -s | jq
*/
router.post('/sendpay', (req, res) => {
    return client.sendpay(req.body.route, req.body.hash)
        .then(result => res.send(result));
});

module.exports = router;

