/**
 * Events.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

 	attributes: {

	  	nomEvent: { type:'string' },
	  	adresse:{ type:'string' },
	  	codePostal:{ type:'string' },
	  	ville:{ type:'string' },
	  	dateDebut:{ type:'datetime' },
	  	dateFin: {
		  	type: 'datetime',
		    defaultsTo: function() {
		   		new Date();
	  		}
	  	},
	  	typeEvent: {
	  		model:'typeEvent' 
	  	},
	  	descEvent: {type:'string' },
	 	longEvent: {type:'float' },
	  	lattEvent: {type:'float' }
	  	 	
  	}
};

