'use strict';

const router = require('express-promise-router')();

const settings = require('../settings');

router.get('/', (req, res) => {
	return settings.getSettings()
		.then(response => res.send(response));
});

router.put('/', (req, res) => {
	return settings.updateSettings(req.body)
		.then(response => res.send(response));
});

module.exports = router;
