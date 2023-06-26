/**
 * Datastores
 * (sails.config.datastores)
 *
 * A set of datastore configurations which tell Sails where to fetch or save
 * data when you execute built-in model methods like `.find()` and `.create()`.
 *
 *  > This file is mainly useful for configuring your development database,
 *  > as well as any additional one-off databases used by individual models.
 *  > Ready to go live?  Head towards `config/env/production.js`.
 *
 * For more information on configuring datastores, check out:
 * https://sailsjs.com/config/datastores
 */

module.exports.datastores = {


  /***************************************************************************
  *                                                                          *
  * Your app's default datastore.                                            *
  *                                                                          *
  * Sails apps read and write to local disk by default, using a built-in     *
  * database adapter called `sails-disk`.  This feature is purely for        *
  * convenience during development; since `sails-disk` is not designed for   *
  * use in a production environment.                                         *
  *                                                                          *
  * To use a different db _in development_, follow the directions below.     *
  * Otherwise, just leave the default datastore as-is, with no `adapter`.    *
  *                                                                          *
  * (For production configuration, see `config/env/production.js`.)          *
  *                                                                          *
  ***************************************************************************/

  default: {

    // adapter: 'sails-mongo',
    // host: '127.0.0.1',
    // port: '27017',
    // user: 'render',
    // password: 'G6dTYoIBKE07hc9L',
    // database: 'activityOverlord'

    adapter: 'sails-mongo',
    url: 'mongodb://render:G6dTYoIBKE07hc9L@ac-3hkowtl-shard-00-00.mztoijr.mongodb.net:27017,ac-3hkowtl-shard-00-01.mztoijr.mongodb.net:27017,ac-3hkowtl-shard-00-02.mztoijr.mongodb.net:27017/?ssl=true&replicaSet=atlas-3ypj58-shard-0&authSource=admin&retryWrites=true&w=majority',
  },

};
