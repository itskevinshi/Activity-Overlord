/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    'new': function (req, res) {
      res.view();
    },
  
    create: async (req, res) => {
      console.log('creating user');
      const user = await User.create(req.allParams()).fetch();
      req.session.authenticated = true;
      req.session.User = user;
      await User.update(user.id).set({ online: true });
      const updatedUser = await User.findOne(user.id);
      console.log(updatedUser.id);
      sails.sockets.broadcast("user", updatedUser);
    
      // Publish the created user to all subscribers
      // User.publish({
      //   id: updatedUser.id,
      //   loggedIn: true,
      //   name: updatedUser.name,
      //   action: ' has been created.'
      // });
      res.redirect('/user/show/' + updatedUser.id);
    },       
  
    show: function (req, res, next) {
      User.find({ where: { id: req.params['id'] }, limit: 1 })
        .then(function foundUser(user) {
          if (!user) return next();
          res.view({
            user: user[0]
          });
        })
        .catch(function (err) {
          if (err) return next(err);
        });
    },
  
    index: function (req, res, next) {
      User.find(function foundUsers(err, users) {
        if (err) return next(err);
        res.view({
          users: users
        });
      });
    },
  
    edit: function (req, res, next) {
      User.find({ where: { id: req.params['id'] }, limit: 1 })
        .then(function foundUser(user) {
          if (!user) return next('User does not exist.');
          res.view({
            user: user[0]
          });
        })
        .catch(function (err) {
          if (err) return next(err);
        });
    },
  
    update: function (req, res, next) {
      var data = {
        name: req.param("name"),
        title: req.param("title"),
        email: req.param("email"),
        admin: req.param("admin") ? true : false,
      };
    
      User.update(req.param('id'), data, function userUpdated(err) {
        if (err) {
          return res.redirect('/user/edit/' + req.param('id'));
        }
        console.log(req.param('id'));
    
        // Publish the updated user to all subscribers
        User.publish([req.param('id')], {
          id: req.param('id'),
          loggedIn: true,
          name: data.name,
          title: data.title,
          email: data.email,
          admin: data.admin,
          action: ' has been updated.'
        });
    
        res.redirect('/user/show/' + req.param('id'));
      });
    },    
  
    destroy: function (req, res, next) {
      User.find({ where: { id: req.params['id'] }, limit: 1 })
        .then(function foundUser(users) {
          if (users.length === 0) return next('User does not exist.');
    
          // Publish the destroyed user to all subscribers
          User.publish([req.params['id']], {
            id: req.params['id'],
            name: users[0].name,
            loggedIn: false,
            action: ' has been deleted.'
          });
    
          // Wait for the User.destroy operation to complete before redirecting
          User.destroy(req.params['id']).exec(function userDestroyed(err) {
            if (err) return next(err);
    
            res.redirect('/user');
          });
        })
        .catch(function (err) {
          if (err) return next(err);
        });
    },
    
  
    subscribe: function (req, res) {
      User.find(function foundUsers(err, users) {
        if (err) return next(err);
    
        // Map the array of user objects to an array of user ids
        var userIds = users.map(function(user) {
          return user.id;
        });
    
        User.subscribe(req.socket, userIds);
        sails.sockets.join(req, 'user');
        res.send(200);
      });
    }
    
  };
  