/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	select: function(req, res) {
		if (req.session.user) {
			console.log("Fetching Session - ");
			console.log(req.session.user);
			return res.status(200).json({'err': null, 'res' : req.session.user});
		} else {
			console.log("Fetching Session - Unknown");
			return res.status(200).json({'err': null, 'res' : false});
		}
	},
	delete: function(req, res) {
		console.log("Deleting Session - ");
		console.log(req.session.user);
		req.session.destroy(function(err) {
			if (err) {
				return res.status(500).json({'err': err, 'res': null});
			}
			return res.status(200).json({'err': null, 'res': 0});
		});
	}
};

