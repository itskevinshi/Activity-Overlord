// custom.js
document.addEventListener('DOMContentLoaded', function() {
    var socket = io.connect();
  
    io.socket.on('connect', function socketConnected() {
      // Subscribe to the user model

      io.socket.get('/user/subscribe', function gotResponse(body, response) {
          console.log('Subscribed: ', body,response);
      });
      // Listen for updates from the server
      io.socket.on('user', function (event) {
        console.log(event);
        if (event.action === ' has been deleted.') {
          // Handle user deletion
          console.log('User deleted:', event);
          displayFlashActivity(event);
          UserIndexPage.destroyUser(event.id);
        } else if (event.action === ' has been created.') {
          // Handle user creation
          console.log('User created:', event);
          //UserIndexPage.addUser(event);
        } else if (event.action === ' has been updated.') {
          console.log('User updated:', event);
          UserIndexPage.updateUser(event);
          displayFlashActivity(event);
        } else if (event.loggedIn) {
          var row = document.querySelector(`tr[data-id="${event.id}"]`);
          var iconCell = row.querySelector('td:first-child');
          iconCell.innerHTML = '<img src="/images/icon-online.png">';
          displayFlashActivity(event);
        } else if (!event.loggedIn) {
          var row = document.querySelector(`tr[data-id="${event.id}"]`);
          var iconCell = row.querySelector('td:first-child');
          iconCell.innerHTML = '<img src="/images/icon-offline.png">';
          displayFlashActivity(event);
        }
        console.log('Received user update:', event);
      });
      
      io.socket.on('message', function messageReceived(message) {
        console.log("heres the message: ", message);
        UserIndexPage.addUser(message);
      
        // Store the alert message in localStorage
        localStorage.setItem('alertMessage', message.name + ' has signed up and logged in');
      
        // Refresh the page
        location.reload();
      });
      
      // Check for the presence of an alert message in localStorage after the page has reloaded
      var alertMessage = localStorage.getItem('alertMessage');
      if (alertMessage) {
        $('#chatAudio')[0].play();
        $(".navbar").after("<div class='alert alert-success'>" + alertMessage + "</div>");
        $(".alert").fadeOut(5000);
      
        // Remove the alert message from localStorage
        localStorage.removeItem('alertMessage');
      }
      
  });
  
    console.log('Custom script initialized.');

    // function cometMessageReceivedFromServer(message) {
    //     console.log("heres the message: ", message);

    //     if (message.model === 'user') {
    //         var userId = message.id
    //         updateUserInDom(userId, message);
    //     }
    // }
    function displayFlashActivity(message) {
      $('#chatAudio')[0].play();
      $(".navbar").after("<div class='alert alert-success'>" + message.name + message.action + "</div>");
      $(".alert").fadeOut(5000);
    }
    
    function updateUserInDom(userId, message) {

    // What page am I on?
    var page = document.location.pathname;

    // Strip trailing slash if we've got one
    page = page.replace(/(\/)$/, '');
    
    // Route to the appropriate user update handler based on which page you're on
    switch (page) {

        // If we're on the User Administration Page (a.k.a. user index)
        case '/user':

        // This is a message coming from publishUpdate
        if (message.verb === 'update') {
            UserIndexPage.updateUser(userId, message);
        }

        // This is a message coming from publishCreate
        if(message.verb === 'create') {
            UserIndexPage.addUser(message);
        }
        // This is a message coming publishDestroy
        if(message.verb === 'destroy') {
            UserIndexPage.destroyUser(userId);
        }
        break;
    }
    }
    var UserIndexPage = {

        // Update the User, in this case their login status
        // updateUser: function(id, message) {
        //   if (message.data.loggedIn) {
        //     var $userRow = $('tr[data-id="' + id + '"] td img').first();
        //     $userRow.attr('src', "/images/icon-online.png");
        //   } else {
        //     var $userRow = $('tr[data-id="' + id + '"] td img').first();
        //     $userRow.attr('src', "/images/icon-offline.png");
        //   }
        // },

        updateUser: function(user) {
          var row = document.querySelector(`tr[data-id="${user.id}"]`);
          row.querySelector('td:nth-child(2)').textContent = user.id;
          row.querySelector('td:nth-child(3)').textContent = user.name;
          row.querySelector('td:nth-child(4)').textContent = user.title;
          row.querySelector('td:nth-child(5)').textContent = user.email;
          row.querySelector('td:nth-child(6)').innerHTML = user.admin ? '<img src="/images/admin.png">' : '<img src="/images/pawn.png">';
        },

        // Add a user to the list of users in the User Administration Page
        addUser: function(user) {
          var row = '<tr data-id="' + user.id + '" data-model="user">';
          row += user.online ? '<td><img src="./images/icon-online.png"></td>' : '<td><img src="./images/icon-offline.png"></td>';
          row += '<td>' + user.id + '</td>';
          row += '<td>' + user.name + '</td>';
          row += '<td>' + user.title + '</td>';
          row += '<td>' + user.email + '</td>';
          row += user.admin ? '<td><img src="/images/admin.png"></td>' : '<td><img src="/images/pawn.png"></td>';
          row += '<td><a href="/user/show/' + user.id + '" class="btn btn-sm btn-primary">Show</a></td>';
          row += '<td><a href="/user/edit/' + user.id + '" class="btn btn-sm btn-warning">Edit</a></td>';
          row += '<td><form action="/user/destroy/' + user.id + '" method="POST">';
          row += '<input type="hidden" name="_method" value="delete"/>';
          row += '<input type="submit" class="btn btn-sm btn-danger" value="Delete"/>';
          row += '<input type="hidden" class="_csrf" name="_csrf" value="' + window.overlord.csrf || '' + '" />';
          row += '</form></td></tr>';

          // Add the template to the bottom of the User Administration Page
          $('tr:last').after(row);
        },      
        // // Add a user to the list of users in the User Administration Page
        // addUser: function(user) {
      
        // // obj is going to encompass both the new user data as well as the _csrf info from 
        // // the layout.ejs file
        // var obj = {
        //   user: user,
        //   _csrf: window.overlord.csrf || ''
        // };
        // console.log('obj: ', obj);
      
        // // Add the template to the bottom of the User Administration Page
        //   $( 'tr:last' ).after(
            
        //     // This is the path to the templates file
        //     JST['assets/templates/addUser.ejs']( obj )
        //   );
        // },
      
        // Remove the user from the User Administration Page
        destroyUser: function(id) {
          $('tr[data-id="' + id + '"]').remove();
        }
      }

});
  