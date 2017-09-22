'use strict';

const path = require('path');
const net = require('net');
const _ = require('lodash');

const LightningError = require('./lightning-error');

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
		this.clientConnectionPromise = new Promise(resolve => {
			_self.client.on('connect', () => {
				console.log(`Lightning client connected`);
				_self.reconnectWait = 1;
				resolve();
			});

			_self.client.on('end', () => {
				console.log('Lightning client connection closed, reconnecting');
				_self.increaseWaitTime();
				_self.reconnect();
			});

			_self.client.on('error', error => {
				console.log(`Lightning client connection error`, error);
				_self.increaseWaitTime();
				_self.reconnect();
			});
		});

		this.waitingFor = {};

		this.client.on('data', data => {
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
			return Promise.reject(new LightningError('invalid_call'));
		}

		const _self = this;

		const callInt = Math.round(Math.random() * 10000);
		const sendObj = {
			method,
			params: args,
			id: callInt
		};

        // Wait for the client to connect
		return this.clientConnectionPromise
            .then(() => {
                // Wait for a response
	return new Promise((resolve, reject) => {
		this.waitingFor[callInt] = response => {
			if (_.isNil(response.error)) {
				resolve(response.result);
				return;
			}

			reject(new LightningError(response.error));
		};

                    // Send the command
		_self.client.write(JSON.stringify(sendObj));
	});
});
	}

	devBlockheight() {
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

	devRhash(secret) {
		return this.call('dev-rhash', [secret]);
	}

	devCrash() {
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

	devFail(id) {
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

	devPing(peerid, len, pongbytes) {
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
