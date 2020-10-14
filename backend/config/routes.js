/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },
//Auth

//'post /login': 'AuthController.login',
'post /login': {
  controller: 'AuthController',
  action: 'login',
   cors: {
   allowOrigins: ['http://localhost:4200'],
   allowCredentials: false
   }
 },
 'POST /register': {
  controller: 'AuthController',
  action: 'register',
   cors: {
   allowOrigins: ['http://localhost:4200'],
   allowCredentials: false
   }
 },
//'post /register': 'AuthController.register',
//'post /signup': 'AuthController.signup',
'/logout': 'AuthController.logout',
'get /user': 'UserController.getUser',

 'POST /signup': {
  controller: 'AuthController',
  action: 'socialRegister',
   cors: {
   allowOrigins: ['http://localhost:4200'],
   allowCredentials: false
   }
 },
 'POST /auth/google': {
  controller: 'AuthController',
  action: 'googleAuth',
   cors:  ["*"] /*{
   allowOrigins: ['http://localhost:4200'],
   allowCredentials: false
   }*/
 },

 'POST /auth/facebook': {
   controller: 'AuthController', 
   action: 'facebookAuth',
   cors: {
          allowOrigins: ['http://localhost:4200'],
          allowCredentials: false
        }
  },
  
 'GET /auth/facebook/currentuser': {
  controller: 'AuthController', 
  action: 'fbCurrentUser',
  cors: {
         allowOrigins: ['http://localhost:4200'],
         allowCredentials: false
       }
 },
 'GET /auth/google/currentuser': {
  controller: 'AuthController', 
  action: 'googleCurrentUser',
  cors: {
         allowOrigins: ['http://localhost:4200'],
         allowCredentials: false
       }
 },

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
