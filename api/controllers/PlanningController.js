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
				angular.forEach(req.param('checkedEvents'), function(el, i) {
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

	}
};

