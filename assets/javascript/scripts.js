//array of characters to choose from, turned into buttons later
var topics = ["Tyrion Lannister", "Jamie Lannister", "Cersi Lannister", "Jon Snow", "Ned Stark", "Bran Stark", "Sansa Stark", "Arya Stark", "Rickon Stark", "Catelyn Stark", "Petyr Baelish", "Robert Baratheon", "Joffery Baratheon", "Melisandre", "Stannis Baratheon"];
//giphy api link
var queryURL = "https://api.giphy.com/v1/gifs/search"; //api_key= dc6zaTOxFJmzC &limit=10";
//api key to use giphy api
var api = "dc6zaTOxFJmzC";
//undefined vars that will be used later
var query, still, animate;

//function to take the topics array and generate buttons
function setButtons(){
  //jQuery for loop to loop through the array and generate a button for each index of the topics array
  $.each(topics, function(i) { $('#buttons').append('<button id="char-btns" class="btn btn-primary">' + topics[i] + '</button>'); });
}
//calling the setButtons function to load all buttons on screen
setButtons();

// function to return the gifs once a button is clicked
function displayGifs() {
  //adding the appropriate query strings to the api link url
  queryURL += '?' + $.param({'api_key': api, 'q': query, 'limit': 10 });

  //jQuery ajax method to return the giphy api
  $.ajax({ url: queryURL, method: "GET"}).done(function(response) {
    //logging response to console for debugging and reading json data
    console.log(response);
    //jQuery for loop to loop through the response.data array
    $.each(response.data, function(j) {
      //var creating a div that will hold the imgage content (image and rating)
      var image_content = $('<div class="gifs">');
      //var creating a p element to hold the image rating
      var rating_area = $('<p>').text('Rating: ' + response.data[j].rating);
      //var to hold the gif image
      var gif_area = $('<img class="img-responsive">');
      //adding attributes to the img elements
      gif_area.attr({
        //setting intial src to still image
        'src': response.data[j].images.fixed_height_still.url,
        //storing still image in attribute named data-still
        'data-still': response.data[j].images.fixed_height_still.url,
        //storing animated gif in attribute named data-animate
        'data-animate': response.data[j].images.fixed_height.url,
        //storing conditional term to be used later to flip on or off the gif animation
        'data-state': 'still'
      });
      //appending the paragraph element to the image content div
      image_content.append(rating_area);
      //appending the gif to the image content div
      image_content.append(gif_area);
      //prepending the entire image div to the images div
      $('#images').prepend(image_content);
    });
  });
}

//handler to listen for click on the add characters button
$('#add-characters').on('click', function(event){
  //prevents the page from reloading once clicked
  event.preventDefault(event);
  //conditional to check if the input field is blank
  if ($('#search-bar').val().length > 0) {
    //if the field is not blank, store value of the input field in the newButton var
    var newButton = $('#search-bar').val();
    //clear all the buttons on the screen
    $('#buttons').empty();
    //add the new input field value to the topics array
    topics.push(newButton);
    //re-generate all buttons on screen, with the newest button added too
    setButtons();
    $('#search-bar').val('');
  }
});

//handler to listen for click on an img element (using delegated handler for dynamic content)
$(document).on('click', 'img', function(){
  //store the data-state attribute in the state var
  var state = $(this).attr('data-state');
  //console.log the state for debugging
  console.log(state);
  //conditional for image. If the data-state is still, then...
  if (state == 'still') {
    //...change the src attribute of the image to the data-animate attribute
    $(this).attr('src', $(this).attr('data-animate'));
    //...change the data-state attribute to animate
    $(this).attr('data-state', 'animate');
    //if state doesn't equal still, then...
  } else {
    //...change the src attribute of the image to the data-still attribute
    $(this).attr('src', $(this).attr('data-still'));
    //..change the data-state attribute to still
    $(this).attr('data-state', 'still');
  }
});

//handler to listen for click on the buttons generated by looping through the topics array
$(document).on('click', '#char-btns', function(){
  //clear out all images already present
  $('#images').empty();
  //stores the value of the button in the query var, which is hoisted to the queryURL to return gifs on that topic
  query = $(this).html();
  //call the displayGifs function
  displayGifs();
});
