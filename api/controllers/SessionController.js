/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	select: function(req, res) {
		if (req.session.user) {
			return res.status(200).json({'err': null, 'res' : req.session.user});
		} else {
			return res.status(400).json({'err': 'No active session', 'res' : null});
		}
	}
};

