const express = require('express');
const router = express.Router();
const config = require("./config");

//to execute command from node
const exec = require('child_process').exec;

const cliPath = config.lightningDir;
console.log("Lightning executable: " + cliPath);

/*
  command executor
*/
function runCMD(cliPath, command, callback) {
    const cmd = `${cliPath} ${command}`;
    exec(cmd, function (error, stdout, stderr) {
        try {
            callback(error, JSON.parse(stdout.replace(/\n$/, '')), stderr);
        } catch (e) {
            callback(error, stdout.replace(/\n$/, ''), stderr);
        }

    });
}

/*
  get node info
  curl http://localhost:9000/api/lightning/getinfo -s | jq
*/
router.get('/getinfo', (req, res) => {
    runCMD(cliPath, "getinfo", function (error, stdout) {
        return res.status(200).send({err: error, result: stdout, resHeaders: null});
    });
});

/*
  get peers
  curl http://localhost:9000/api/lightning/getpeers -s | jq
*/
router.get('/getpeers', (req, res) => {
    runCMD(cliPath, "getpeers", function (error, stdout) {
        return res.status(200).send({err: error, result: stdout, resHeaders: null});
    });
});

/*
  get nodes
  curl http://localhost:9000/api/lightning/getnodes -s | jq
*/
router.get('/getnodes', (req, res) => {
    runCMD(cliPath, "getnodes", function (error, stdout) {
        return res.status(200).send({err: error, result: stdout, resHeaders: null});
    });
});

/*
  get channels
  curl http://localhost:9000/api/lightning/getchannels -s | jq
*/
router.get('/getchannels', (req, res) => {
    runCMD(cliPath, "getchannels", function (error, stdout) {
        return res.status(200).send({err: error, result: stdout, resHeaders: null});
    });
});

/*
  new address
  curl http://localhost:9000/api/lightning/getnewaddress -s | jq
*/
router.get('/getnewaddress', (req, res) => {
    runCMD(cliPath, "newaddr", function (error, stdout) {
        return res.status(200).send({err: error, result: stdout, resHeaders: null});
    });
});

/*
  open a channel
  curl -X POST -H 'Content-Type: application/json' -d '{"ip":"localhost","port":"8899","rawtx":"copy from get raw transcation"}' http://localhost:9000/api/lightning/openchannel -s | jq
*/
router.post('/openchannel', (req, res) => {
    const cmd = `connect ${req.body.ip} ${req.body.port} ${req.body.rawtx}`;
    runCMD(cliPath, cmd, function (error, stdout) {
        return res.status(200).send({err: error, result: stdout, resHeaders: null});
    });

});

/*
  close a channel
  curl -X POST -H 'Content-Type: application/json' -d '{"node":"node string"}' http://localhost:9000/api/lightning/closechannel -s | jq
*/
router.post('/closechannel', (req, res) => {
    const cmd = `close ${req.body.node}`;
    runCMD(cliPath, cmd, function (error, stdout) {
        return res.status(200).send({err: error, result: stdout, resHeaders: null});
    });

});

/*
  get route
  curl -X POST -H 'Content-Type: application/json' -d '{"nodeId":"","amount":"","riskfactor":""}' http://localhost:9000/api/lightning/getroute -s | jq
*/
router.post('/getroute', (req, res) => {
    const cmd = `getroute ${req.body.nodeId} ${req.body.amount} ${req.body.riskfactor}`;
    runCMD(cliPath, cmd, function (error, stdout) {
        return res.status(200).send({err: error, result: stdout, resHeaders: null});
    });
});

/*
  create invoice
  curl -X POST -H 'Content-Type: application/json' -d '{"label":"Invoice # 1"}' http://localhost:9000/api/lightning/invoice -s | jq
*/
router.post('/createinvoice', (req, res) => {
    const cmd = `invoice ${req.body.amount} ${req.body.label}`;
    runCMD(cliPath, cmd, function (error, stdout) {
        return res.status(200).send({err: error, result: stdout, resHeaders: null});
    });
});

/*
  list invoice
  curl http://localhost:9000/api/lightning/listinvoice -s | jq
*/
router.get('/listinvoice', (req, res) => {
    runCMD(cliPath, "listinvoice", function (error, stdout) {
        return res.status(200).send({err: error, result: stdout, resHeaders: null});
    });
});

/*
  send pay
  curl -X POST -H 'Content-Type: application/json' -d '{"route":"","hash":""}' http://localhost:9000/api/lightning/sendpay -s | jq
*/
router.post('/sendpay', (req, res) => {
    const cmd = `sendpay ${req.body.route} ${req.body.hash}`;
    runCMD(cliPath, cmd, function (error, stdout) {
        return res.status(200).send({err: error, result: stdout, resHeaders: null});
    });
});

module.exports = router;

