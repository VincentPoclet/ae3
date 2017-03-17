/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req, res) {
		// console.log(req);
		Users.findOne({
			emailUser: req.param('emailUser'),
		}).exec(function(err, row) {
			if (err) {
				return res.status(500).json({'err': err.message, 'data': row});
			} 
			if (row) {
				return res.status(400).json({'err': 'Email already exists', 'data': row});
			}
			Users.create({
				nomUser: req.param('nomUser'),
				pwdUser: req.param('pwdUser'),
				prenomUser: req.param('prenomUser'),
				emailUser: req.param('emailUser'),
				typeUser: req.param('typeUser')
			}).exec(function(err, row) {
				if (err) {
					return res.status(500).json({'err': err.message, 'data': row});
				} 
				return res.status(200).json({'err': null, 'data': row});
			});
		});
	},

	select: function(req,res){
		// console.log(req);
		Users.findOne({
			emailUser: req.param('emailUser'),
			pwdUser: req.param('pwdUser'),
		}).exec(function(err, row) {
			if (err) {
				return res.status(500).json({'err': err.message, 'data': row});
			} 
			if (row) {
				return res.status(200).json({'err': null, 'data': row});
			} else {
				return res.status(400).json({'err': "User doesn't exists", 'data': null});
			}
		});
	}
};
