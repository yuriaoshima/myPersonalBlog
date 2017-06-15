//url for server provided by instructor (MongoDB)
var url = 'https://pacific-meadow-64112.herokuapp.com/data-api/taoshima';

//array to hold the blog items as objects
var blogItems = [];

//at startup read from database and load the page with blog entries. Also create delete buttons for each entry
$(document).ready(function() {
  /*$.ajax(url, {
    method: 'GET',
    success: function(data) {
      var body = $('#blogBody');
      //set the blog items to the data we got from the db
      blogItems = data;
      for (var i = 0; i < blogItems.length; i++) {
        var title = $('<h3>').text(blogItems[i].title);
        var date = $('<h4>').text(blogItems[i].date);
        var body = $('<p>').text(blogItems[i].entry);
        //create a delete button to append to the entry and also save the database id into the value attr of the button
        var delButton = $('<button>').text('Delete Entry').attr('val', blogItems[i]._id).attr('type', 'button');
        $('#blogBody').append($('<div>').append(title).append(date).append(body).append(delButton).append($('<hr>')));
        //must add the event handler here so that each button has a handler. This way we don't need unique ids for each button. We can also pass in the db id for each button
        delButton.on('click', function() {
          handleDelete(delButton.attr('val'));
        });
      }
    }
  });*/
  loadPage();
});

//event handlers
$('#newEntry').on('click', addNewIdea);
$('#cancel').on('click', handleCancel);
$('#submit').on('click', handleEntrySubmit);
$('#clear').on('click', clearDatabase);

/*function that reveals the form when user wants to add new idea*/
function addNewIdea() {
  //enter today's date as default
  //user can still pick another date if they want
  var today = returnDate();
  $('#todaysDate').attr('value', today);
  /*reveal the form and hide everything else*/
  $('body > h1').css('display', 'none');
  $('aside').css('display', 'none');
  $('#newIdeaForm').css('display', 'block');
  $('#blogBody').css('display', 'none');
}

/*function to hide the form when user clicks cancel*/
function handleCancel() {
  //hides the form but reveals everything else
  $('body > h1').css('display', 'block');
  $('aside').css('display', 'block');
  $('#blogBody').css('display', 'block');
  $('#newIdeaForm').css('display', 'none'); 
}

/*this function will take the new title and blog entry and add it to the entries already on the main blog page*/
function handleEntrySubmit() {
  //get the user entered title
  var entryTitle = $('#title').val();
  //get the user entered date or default date
  var entryDate = $('#todaysDate').val();
  //get the blog body that the user entered
  var blogEntry = $('#entry').val();
  //get the html section with id blogBody
  var blogBody = $('#blogBody');
  
  //create html elements for title, date, and the blog entry
  var title = $('<h3>').text(entryTitle);
  var date = $('<h4>').text(entryDate);
  var body = $('<p>').text(blogEntry);
  
  //save this data to a MONGO database server provided by instructor using the REST API 
  $.ajax(url, {
    method: 'POST',
    data: {
      title: entryTitle,
      date: entryDate,
      entry: blogEntry
    },
    success: function() {
      console.log("data posted successfully");
    },
    error: function() {
      cosole.log("AJAX error. Data not posted");
    }
  });
  
  //now get the data and load the page
  /*$.ajax(url, {
    method: 'GET',
    success: function(data) {
      var body = $('#blogBody');
      blogItems = data;
      for (var i = 0; i < blogItems.length; i++) {
        var title = $('<h3>').text(blogItems[i].title);
        var date = $('<h4>').text(blogItems[i].date);
        var body = $('<p>').text(blogItems[i].entry);
        var delButton = $('<button>').text('Delete Entry').attr('val', blogItems[i]._id).attr('type', 'button');
        $('#blogBody').append($('<div>').append(title).append(date).append(body).append(delButton).append($('<hr>')));
        //add event handler for each button like in the document.ready function
        delButton.on('click', function() {
          handleDelete(delButton.attr('val'));
        });
      }
    }
  });*/
  blogBody.html("");
  loadPage();

  //when user clicks submit remove the values entered in form so that it is blank for the next form submission
  $('#title').val('');
  $('#entry').val('');
  
  //when user clicks submit, the form needs to be hidden which is the same functionality as the handleCancel function
  handleCancel();
}

function returnDate() {
  /*set today's date on the date input field for user convenience. They can still change it if they want*/
  var today = new Date();
  var date = today.getDate();
  var month = today.getMonth() + 1;
  var year = today.getFullYear();
  //add a zero in front of single digit dates and months
  if (date < 10) {
    date = "0" + date;
  }
  if (month < 10) {
    month = "0" + month;
  }
  today = year + '-' + month + '-' + date;
  return today;
}

//clear database that we are using to store the blog data
function clearDatabase() {
  //clear the database. First get the id of each item in the dataabase
  $.ajax(url, {
    method: 'GET',
    success: function(data) {
      data.forEach(function(items) {
        $.ajax(url + '/' + items._id, {
          method: 'DELETE',
          success: function() {
            console.log("database cleared");
          },
          error: function() {
            console.log("could not clear database");
          }
        });
      });
    }
  });
}

//if user clicks delete button inside the blogBody call delete function
function handleDelete(id) {
  $.ajax(url + '/' + id, {
    method: 'DELETE',
    success: function() {
      console.log("database cleared");
    },
    error: function() {
      console.log("could not clear database");
    }
  });
}

function loadPage() {
  //now get the data and load the page
  $.ajax(url, {
    method: 'GET',
    success: function(data) {
      var body = $('#blogBody');
      blogItems = data;
      for (var i = 0; i < blogItems.length; i++) {
        var title = $('<h3>').text(blogItems[i].title);
        var date = $('<h4>').text(blogItems[i].date);
        var body = $('<p>').text(blogItems[i].entry);
        var delButton = $('<button>').text('Delete Entry').attr('val', blogItems[i]._id).attr('type', 'button');
        $('#blogBody').append($('<div>').append(title).append(date).append(body).append(delButton).append($('<hr>')));
        //add event handler for each button like in the document.ready function
        delButton.on('click', function() {
          handleDelete(delButton.attr('val'));
        });
      }
    }
  });
}
