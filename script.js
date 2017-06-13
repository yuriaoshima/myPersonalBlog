//url for server provided by instructor (MongoDB)
var url = 'https://pacific-meadow-64112.herokuapp.com/data-api/taoshima';

//array to hold the blog items as objects
var blogItems = [];

//initialize the blog template
var blogTemplate = Handlebars.compile($('#blogTemplate').html());

//at startup, read from the MONGO database and load the blog entries into the webpage
$(document).ready(function() {
  $.ajax(url, {
    method: 'GET',
    success: function(items) {
      //set the blog items array equal to the "items" we got from the database
      blogItems = items;
      console.log(blogItems);
      /*now take this data and enter into the template. You always have to have the var data = {} format where whatever is in the {} has to match the keywork you put in the template*/
      var data = {blogItems};
      var html = blogTemplate(data);
      $('#blogBody').html(html);
    }
  });
});

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
  //attach elements to divs which are used to separate different entries
  blogBody.append($('<div>').append(title).append(date).append(body));
  
  //when user clicks submit remove the values entered in form so that it is blank for the next form submission
  $('#title').val('');
  $('#entry').val('');
  
  //when user clicks submit, the form needs to be hidden which is the same functionality as the handleCancel function
  handleCancel();
  
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