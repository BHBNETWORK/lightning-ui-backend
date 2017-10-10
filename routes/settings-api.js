'use strict';

const _ = require('lodash');
const router = require('express-promise-router')();
const Datastore = require('nedb');

const SephirotError = require('../sephirot-error');

const db = new Datastore({filename: 'settings.database', autoload: true});

const validUnits = ['XBT', 'SAT', 'mSAT'];

const validationRules = {
	unit: value => _.includes(validUnits, value),
	advancedMode: value => _.isBoolean(value),
	feeRate: value => value === 'AUTO' || _.isNumber(value)
};

const defaultSettings = {
	unit: 'SAT',
	advancedMode: false,
	feeRate: 'AUTO'
};

router.get('/', (req, res) => {
	return new Promise((resolve, reject) => {
		db.find({name: 'settingsObject'}, (err, docs) => {
			if (err) {
				reject(new SephirotError('db_query_error'));
				return;
			}

			const loadedSettings = docs[0] || {settings: {}};
			res.send(_.defaultsDeep(loadedSettings.settings, defaultSettings));
			resolve();
		});
	});
});

router.put('/', (req, res) => {
	const validNewParamsKeys = _.intersection(_.keys(req.body), _.keys(defaultSettings));
	const cleanNewParams = {};

    // Make sure the new value is valid according to the validation rules
	_.each(validNewParamsKeys, key => {
		if (!_.isFunction(validationRules[key]) || validationRules[key].call(null, req.body[key]) === true) {
			cleanNewParams[key] = req.body[key];
		}
	});

	return new Promise((resolve, reject) => {
		db.update({name: 'settingsObject'}, {name: 'settingsObject', settings: cleanNewParams}, {upsert: true}, err => {
			if (err) {
				reject(new SephirotError('db_query_error'));
				return;
			}

			res.send({error: null});
			resolve();
		});
	});
});

module.exports = router;
