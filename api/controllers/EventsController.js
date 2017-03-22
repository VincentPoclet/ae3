/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req, res) {
		Events.findOne({
			nomEvent: req.param('nomEvent'),
			ville: req.param('ville'),
			dateDebut: req.param('dateDebut')
		}).exec(function(err, row) {
			if (err) {
				return res.status(500).json({'err': err.message, 'data': row});
			} 
			if (row) {
				return res.status(400).json({'err': 'Event already exists', 'data': row});
			}
			Events.create({
				nomEvent: req.param('nomEvent'),
				adresse: req.param('adresse'),
				codePostal: req.param('codePostal'),
				ville: req.param('ville'),
				dateDebut: req.param('dateDebut'),
				dateFin: req.param('dateFin'),
				typeEvent: req.param('typeEvent'),
				descEvent: req.param('descEvent'),
				longEvent: req.param('longEvent'),
				lattEvent: req.param('lattEvent')
			}).exec(function(err, row) {
				if (err) {
					return res.status(500).json({'err': err.message, 'data': row});
				}
				return res.status(200).json({'err': null, 'data': row});
			});
		});
	},

	select: function(req,res){
		Events.find({}).exec(function(err, row) {
			if (err) {
				return res.status(500).json({'err': err.message, 'data': row});
			} 
			if (row) {
				return res.status(200).json({'err': null, 'data': row});
			}
		});
	},

	delete: function(req, res) {
		Events.destroy({
			longEvent: req.param.longEvent,
			lattEvent: req.param.lattEvent,
		}).exec(function(err, row) {
			if (err) {
				return res.status(500).json({'err': err.message, 'data': null});
			}
			if (!row) {
				return res.status(400).json({'err': 'No events found according to criterias', 'data': null});
			}
			return res.status(200).json({'err': null, 'data': row});
		});
	},

	update: function(req, res) {
		Events.update({
			longEvent: req.param.long,
			lattEvent: req.param.latt
		}, {
			nomEvent: req.param('nomEvent'),
			adresse: req.param('adresse'),
			codePostal: req.param('codePostal'),
			ville: req.param('ville'),
			dateDebut: req.param('dateDebut'),
			dateFin: req.param('dateFin'),
			typeEvent: req.param('typeEvent'),
			descEvent: req.param('descEvent'),
			longEvent: req.param('longEvent'),
			lattEvent: req.param('lattEvent')
		}).exec(function(err, row) {
			if (err) {
				return res.status(500).json({'err': err, 'data': null});
			}
			if (!row) {
				return res.status(400).json({'err': 'No events found according to criterias', 'data': null});
			}
			return res.status(200).json({'err': null, 'data': row});
		})
	}
};
