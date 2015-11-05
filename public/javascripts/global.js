// Userlist array for info box
var userListData = [];

// DOM ready
$(document).ready(function() {
  // pop. user table on page load
  populateTable();

  /// Username link click
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

  $('#btnAddUser').on('click', addUser);

  // delete user
  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

});

// Fill table
function populateTable() {
    var tableContent = '';

    // AJAX call for JSON
    $.getJSON('/users/userlist', function(data){

      userListData = data;

      $.each(data, function() {
        tableContent += '<tr>';
        tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username +
        '">' + this.username + '</a></td>';
        tableContent += '<td>' + this.email + '</td>';
        tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id +
        '">delete</a></td>'; 
        tableContent += '<tr>';
      });
      // place table content inside existing html table
      $('#userList table tbody').html(tableContent);

    });
}

// show user info
function showUserInfo(event) {
  event.preventDefault();
  // retrieve username from rel attr
  var thisUserName = $(this).attr('rel');

  // get index of object based on id
   var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

  // get user object
  var thisUserObj = userListData[arrayPosition];

  // populate info box
  $('#userInfoName').text(thisUserObj.fullname);
  $('#userInfoAge').text(thisUserObj.age);
  $('#userInfoGender').text(thisUserObj.gender);
  $('#userInfoLocation').text(thisUserObj.location);
  }

// add user
function addUser(event){
  event.preventDefault();

  // form validation
  var errorCount = 0;
  $('#addUser input').each(function(index, val){
    if($(this).val() === '') {errorCount++;}
  });

  if (errorCount === 0) {
    var newUser = {
      'username' : $('#addUser fieldset input#inputUserName').val(),
      'email': $('#addUser fieldset input#inputUserEmail').val(),
      'fullname': $('#addUser fieldset input#inputUserFullname').val(),
      'age': $('#addUser fieldset input#inputUserAge').val(),
      'location': $('#addUser fieldset input#inputUserLocation').val(),
      'gender': $('#addUser fieldset input#inputUserGender').val()
    };

    // user AJAX to post to add user service
    $.ajax({
      type: 'post',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    }).done(function(response){
      // check for successful blank response
      if(response.msg === '') {
        // clear form inputs
        $('#addUser fieldset input').val('');

        // update table
        populateTable();
      } else {
        alert('Error: ' + response.msg);
      }
    });
  }
  else {
    // if errorCount > 0
    alert('Please fill in all fields');
    return false;
  }
}

function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {
            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

}
