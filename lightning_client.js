'use strict';

const path = require('path');
const net = require('net');

const _ = require('lodash');

class LightningClient {
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
}

module.exports = LightningClient;