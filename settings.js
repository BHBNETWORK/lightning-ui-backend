'use strict';

const _ = require('lodash');
const Datastore = require('nedb');

const LightningError = require('./lightning-error');

const db = new Datastore({filename: 'settings.database', autoload: true});

const validUnits = ['XBT', 'SAT', 'mSAT'];
const validBackends = ['c-lightning', 'lnd'];

const validationRules = {
	unit: value => _.includes(validUnits, value),
	advancedMode: value => _.isBoolean(value),
	feeRate: value => value === 'AUTO' || _.isNumber(value),
	backend: value => _.includes(validBackends, value)
};

const defaultSettings = {
	unit: 'SAT',
	advancedMode: false,
	feeRate: 'AUTO',
	backend: 'c-lightning'
};

let settingsCache = null;

function getSettings() {
	if (settingsCache !== null) {
		return Promise.resolve(settingsCache);
	}

	return new Promise((resolve, reject) => {
		db.find({name: 'settingsObject'}, (err, docs) => {
			if (err) {
				reject(new LightningError('db_query_error'));
				return;
			}

			const loadedSettings = docs[0] || {settings: {}};
			settingsCache = _.defaultsDeep(loadedSettings.settings, defaultSettings);
			resolve(settingsCache);
		});
	});
}

function updateSettings(newParams) {
	const validNewParamsKeys = _.intersection(_.keys(newParams), _.keys(defaultSettings));
	const cleanNewParams = {};

	// Make sure the new value is valid according to the validation rules
	_.each(validNewParamsKeys, key => {
		if (!_.isFunction(validationRules[key]) || validationRules[key].call(null, newParams[key]) === true) {
			cleanNewParams[key] = newParams[key];
		}
	});

	return new Promise((resolve, reject) => {
		db.update({name: 'settingsObject'}, {name: 'settingsObject', settings: cleanNewParams}, {upsert: true}, err => {
			if (err) {
				reject(new LightningError('db_query_error'));
				return;
			}

			// Invalidates the cache
			settingsCache = null;
			resolve({error: null});
		});
	});
}

module.exports = {
	getSettings,
	updateSettings
};
