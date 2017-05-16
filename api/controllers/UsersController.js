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
				console.log("Creating Session - ");
				req.session.user = {'id': row.id, 'prenom': row.prenomUser, 'nom': row.nomUser};
				console.log(req.session.user);
				// console.log(req.session.user);
				return res.status(200).json({'err': null, 'data': row});
			});
		});
	},
	update: function(req, res) {
		var params = {
			emailUser: req.param('emailUser')
		};
		if (req.param('nomUser')) {
			params.nomUser = req.param('nomUser');
		}
		if (req.param('prenomUser')) {
			params.prenomUser = req.param('prenomUser');
		}
		Users.update({
			emailUser: req.param('emailUserOld')
		}, params).exec(function(err, row) {
			if (err) {
				return res.status(500).json({'err': err.message, 'data': row});
			}
			if (!row) {
				return res.status(400).json({'err': "User doesn't exist", 'data': null});
			}
			console.log("Updating Session - ");
			req.session.user.email = row[0].emailUser;
			req.session.user.nom = row[0].nomUser;
			req.session.user.prenom = row[0].prenomUser;
			console.log(req.session.user);
			return res.status(200).json({'err': null, 'data': row});
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
				req.session.user = {'id': row.id, 'prenom': row.prenomUser, 'nom': row.nomUser, 'email': row.emailUser};
				console.log("Creating Session - ");
				console.log(req.session.user);
				return res.status(200).json({'err': null, 'data': row});
			} else {
				return res.status(400).json({'err': "User doesn't exist", 'data': null});
			}
		});
	}
};
