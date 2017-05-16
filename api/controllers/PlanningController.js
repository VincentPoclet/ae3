/**
 * PlanningController
 *
 * @description :: Server-side logic for managing plannings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req, res) {
		Planning.findOne({
			name: req.param('name'),
			user: req.param('userID'),
			startDate: req.param('startDate')
		}).exec(function(err, row) {
			if (err) {
				return res.status(500).json({'err': err.message, 'data': row});
			} 
			if (row) {
				return res.status(400).json({'err': 'Email already exists', 'data': row});
			}
			Planning.create({
				name: req.param('name'),
				startDate: req.param('startDate'),
				description: req.param('description'),
				user: req.param('userID')
			}).exec(function(err, row) {
				if (err) {
					return res.status(500).json({'err': err.message, 'data': row});
				}
				req.param('checkedEvents').forEach(function (el, i) {
				// angular.forEach(req.param('checkedEvents'), function(el, i) {
					PlannedEvent.create({
						planning: row.id,
						event: el.eventID,
						duration: el.duration,
						order: el.order
					}).exec(function(err_ev, row_ev) {
						if (err) {
							return res.status(500).json({'err': err_ev.message, 'data': row_ev});
						}
					});
				});
				return res.status(200).json({'err': null, 'data': row});
			});
		});
	},
	update: function(req, res) {

	},
	delete: function(req, res) {

	},
	select: function(req, res) {
		console.log("Start");
		var result = {};
		var nbPlan = 1;
		var cmptPl = 0;
		console.log("Initialisation terminée");
		Planning.find({
			user: req.param('idUser')
		}).exec(function(err, row) {
			console.log("Exécution du find terminée");
			if (err) {
				console.log("Erreur !");
				return res.status(500).json({'err': err, 'data': row});
			}
			if (!row) {
				console.log("Ligne vide !");
				return res.status(400).json({'err': 'No planning found', 'data': data});
			}
			result.plannings = row;
			nbPlan = row.length;
			console.log("Parcours des " + nbPlan + " plannings");
			result.plannings.forEach(function(el, i) {
				cmptPl++;
				console.log("Planning numéro " + cmptPl);
				PlannedEvent.find({
					planning: el.id
				}).exec(function(err, row) {
					console.log("Exécution du find terminée");
					if (err) {
						console.log("Erreur !");
						return res.status(500).json({'err': err, 'data': row});
					}
					console.log("Affectation");
					result.plannings[i].events = row;
					// if (cmptPl == nbPlan) {
					// 	return res.status(200).json({'err': null, 'data': result});	
					// }
					console.log("Planning traité");
				});
			});
			console.log(result);
			console.log("Envoi des données :");
			return res.status(200).json({'err': null, 'data': result});
		});
	}
};

