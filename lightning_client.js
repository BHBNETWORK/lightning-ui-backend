'use strict';

const path = require('path');
const net = require('net');

const _ = require('lodash');

class LightningClient {
    // TODO: add a reconnection algorithm, possibly using https://en.wikipedia.org/wiki/Exponential_backoff
    constructor(rpcPath = '~/.lightning') {
        rpcPath = path.join(rpcPath, '/lightning-rpc');
        console.log(`Connecting to ${rpcPath}`);

        const _self = this;

        this.client = net.createConnection(rpcPath);
        this.clientConnectionPromise = new Promise((resolve, reject) => {
            _self.client.on('connect', function () {
                console.log(`Lightning client connected`);
                resolve();
            });

            _self.client.on('error', function () {
                console.log(`Lightning client connection error`);
                reject();
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

                        reject(response.error);
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