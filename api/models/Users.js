/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	attributes: {
		nomUser: {
			type: 'string'
		},
		pwdUser: {
			type: 'string',
			unique : true
		},
		prenomUser: {
			type: 'string'
		},
		emailUser: {
			type: 'string'
		},
	  	goutsUser: {
	      collection:'goutsUser',
	      via: 'user'
	    }
	}
};

