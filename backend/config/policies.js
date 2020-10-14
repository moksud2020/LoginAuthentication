/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/
 /*'*': ['isAuthenticated'],
 
 AuthController: {
     '*': true
 }*/
   '*': true,
  '*': 'isAuth',
  'AuthController': { // Name of your controller
    'register': true,
    'login': true,
    'googleAuth':true,
    'facebookAuth':true,
     // We dont need authorization here, allowing public access
    }
  // whitelist the auth controller
/*	'auth': {
		'*': true
  },
  'AuthController': { // Name of your controller
    'register': true,
    'login': true,
    'googleAuth':true,
     // We dont need authorization here, allowing public access
    }
  */
};
