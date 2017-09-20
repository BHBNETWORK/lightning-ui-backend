'use strict';

const path = require('path');
const net = require('net');

const _ = require('lodash');

function resolveHome(filepath) {
    if (filepath[0] === '~') {
        return path.join(process.env.HOME, filepath.slice(1));
    }

    return filepath;
}

class LightningClient {
    constructor(rpcPath = '~/.lightning') {
        rpcPath = path.join(rpcPath, '/lightning-rpc');
        rpcPath = resolveHome(rpcPath);

        console.log(`Connecting to ${rpcPath}`);

        this.rpcPath = rpcPath;
        this.reconnectWait = 0.5;
        this.reconnectTimeout = null;

        const _self = this;

        this.client = net.createConnection(rpcPath);
        this.clientConnectionPromise = new Promise((resolve) => {
            _self.client.on('connect', function () {
                console.log(`Lightning client connected`);
                _self.reconnectWait = 1;
                resolve();
            });

            _self.client.on('end', function () {
                console.log('Lightning client connection closed, reconnecting');
                _self.increaseWaitTime();
                _self.reconnect();
            });

            _self.client.on('error', function (error) {
                console.log(`Lightning client connection error`, error);
                _self.increaseWaitTime();
                _self.reconnect();
            });
        });

        this.waitingFor = {};

        this.client.on('data', function (data) {
            const dataObject = JSON.parse(data);
            if (!_.isFunction(_self.waitingFor[dataObject.id])) {
                return;
            }

            _self.waitingFor[dataObject.id].call(_self, dataObject);
            delete _self.waitingFor[dataObject.id];
        });
    }

    increaseWaitTime() {
        if (this.reconnectWait >= 16) {
            this.reconnectWait = 16;
        } else {
            this.reconnectWait *= 2;
        }
    }

    reconnect() {
        const _self = this;

        if (this.reconnectTimeout) {
            return;
        }

        this.reconnectTimeout = setTimeout(() => {
            console.log('Trying to reconnect...');
            _self.client.connect(_self.rpcPath);
            _self.reconnectTimeout = null;
        }, this.reconnectWait * 1000);
    }

    call(method, args = []) {
        if (!_.isString(method) || !_.isArray(args)) {
            return Promise.reject({error: 'invalid_call'});
        }

        const _self = this;

        const callInt = Math.round(Math.random() * 10000);
        const sendObj = {
            method: method,
            params: args,
            id: callInt
        };

        // wait for the client to connect
        return this.clientConnectionPromise
            .then(() => {
                // wait for a response
                return new Promise((resolve, reject) => {
                    this.waitingFor[callInt] = (response) => {
                        if (_.isNil(response.error)) {
                            resolve(response.result);
                            return;
                        }

                        reject({error: response.error});
                    };

                    // send the command
                    _self.client.write(JSON.stringify(sendObj));
                });
            });
    }

    dev_blockheight() {
        return this.call('dev-blockheight');
    }

    getnodes() {
        return this.call('getnodes');
    }

    getroute(id, msatoshi, riskfactor) {
        return this.call('getroute', [id, msatoshi, riskfactor]);
    }

    getchannels() {
        return this.call('getchannels');
    }

    invoice(msatoshi, label, r = null) {
        return this.call('invoice', [msatoshi, label, r]);
    }

    listinvoice(label = null) {
        return this.call('listinvoice', [label]);
    }

    delinvoice(label = null) {
        return this.call('delinvoice', [label]);
    }

    waitanyinvoice(label = null) {
        return this.call('waitanyinvoice', [label]);
    }

    waitinvoice(label) {
        return this.call('waitinvoice', [label]);
    }

    help() {
        return this.call('help');
    }

    stop() {
        return this.call('stop');
    }

    getlog(level = null) {
        return this.call('getlog', [level]);
    }

    dev_rhash(secret) {
        return this.call('dev-rhash', [secret]);
    }

    dev_crash() {
        return this.call('dev-crash');
    }

    getinfo() {
        return this.call('getinfo');
    }

    sendpay(route, rhash) {
        return this.call('sendpay', [route, rhash]);
    }

    connect(host, port, id) {
        return this.call('connect', [host, port, id]);
    }

    dev_fail(id) {
        return this.call('dev-fail', [id]);
    }

    getpeers(level = null) {
        return this.call('getpeers', [level]);
    }

    fundchannel(id, satoshis) {
        return this.call('fundchannel', [id, satoshis]);
    }

    close(id) {
        return this.call('close', [id]);
    }

    dev_ping(peerid, len, pongbytes) {
        return this.call('dev-ping', [peerid, len, pongbytes]);
    }

    withdraw(satoshi, destination) {
        return this.call('withdraw', [satoshi, destination]);
    }

    newaddr() {
        return this.call('newaddr');
    }

    addfunds(tx) {
        return this.call('addfunds', [tx]);
    }

    listfunds() {
        return this.call('listfunds');
    }
}

module.exports = LightningClient;