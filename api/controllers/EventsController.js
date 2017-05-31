/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	createMulti: function(req, res) {
		var arr = req.param('events').filter(function(e) {
			return e[10];
		}).map(function(e) {
			return e.slice(0, -1);
		});
		var arrOfObj = [];
		var obj = {};
		arr.forEach(function(data){
			obj.nomEvent = data[0];
			obj.adresse = data[1];
			obj.codePostal = data[2];
			obj.ville = data[3];
			obj.dateDebut = data[4];
			obj.dateFin = data[5];
			obj.typeEvent = data[6];
			obj.descEvent = data[7];
			obj.longEvent = data[8];
			obj.lattEvent = data[9];
			arrOfObj.push(obj);
			obj = {};
		});

		console.log(arr);
		console.log(arrOfObj);
		Events.create(arrOfObj).exec(function(err, row) {
			if (err) {
				return res.status(500).json({'err': err.message, 'data': row});
			}
			return res.status(200).json({'err': null, 'data': row});
		});
	},

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
		Events.findOne({
			longEvent: req.param('longEvent'),
			lattEvent: req.param('lattEvent')
		}).exec(function(err,row){
				console.log(req.param('longEvent'),req.param('lattEvent'));
				if (err) {
					return res.status(500).json({'err': err.message, 'data': row});
				} 
				if (!row) {
					return res.status(400).json({'err': 'Event does not exists', 'data': row});
				}
				Events.destroy({
					longEvent: req.param('longEvent'),
					lattEvent: req.param('lattEvent')
				}).exec(function(err, row) {
					if (err) {
						return res.status(500).json({'err': err.message, 'data': null});
					}
					if (!row) {
						return res.status(400).json({'err': 'No events found according to criterias', 'data': null});
					}
					console.log(req.param('longEvent'),req.param('lattEvent'));
					return res.status(200).json({'err': null, 'data': row});
				});
			})
		},

		// Events.destroy({
		// 	longEvent: req.param('longEvent'),
		// 	lattEvent: req.param('lattEvent')
		// }).exec(function(err, row) {
		// 	if (err) {
		// 		return res.status(500).json({'err': err.message, 'data': null});
		// 	}
		// 	if (!row) {
		// 		return res.status(400).json({'err': 'No events found according to criterias', 'data': null});
		// 	}
		// 	console.log(req.param('longEvent'),req.param('lattEvent'));
		// 	return res.status(200).json({'err': null, 'data': row});
		// });
	//},

	update: function(req, res) {
		Events.update({
			longEvent: req.param('long'),
			lattEvent: req.param('latt')
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
