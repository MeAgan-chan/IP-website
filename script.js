//[STEP 0]: Make sure our document is A-OK
$(document).ready(function () {
  //what kind of interface we want at the start 
  const APIKEY = "5ffd8c4a1346a1524ff12929";
  getContacts();
  $("#update-contact-container").hide();
  $("#add-update-msg").hide();

  //[STEP 1]: Create our submit form listener
  $("#contact-submit").on("click", function (e) {
    //prevent default action of the button 
    e.preventDefault();

    //[STEP 2]: let's retrieve form data
    //rehoming form
    let petName = $("#pet-Name").val();
    let petType = $("#pet-Type").val();
    let petBreed = $("#pet-Breed").val();
    let petAge = $("#pet-Age").val();
    let rehomeReason = $("rehome-Reason").val();
    let addCharac = $("#add-Charac").val();
    //adopting form
    let famNum = $("#fam-Num").val();
    let childAge = $("#child-Age").val();
    let adoptReason = $("#adopt-Reason").val();

    //[STEP 3]: get form values when user clicks on send
    //Adapted from restdb api
    let jsondata = {
      //rehoming form
      "Name": petName,
      "Type": petType,
      "Breed": petBreed,
      "give your pet away": rehomeReason,
      "other characteristics": addCharac,
      //adopting form
      
    };

    //[STEP 4]: Create our AJAX settings. Take note of API key
    let settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://interactivedev-bed4.restdb.io/rest/contact ",
      "method": "POST", //[cher] we will use post to send info
      "headers": {
        "content-type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      },
      "processData": false,
      "data": JSON.stringify(jsondata),
      "beforeSend": function(){
        //@TODO use loading bar instead
        //disable our button or show loading bar
        $("#contact-submit").prop( "disabled", true);
        //clear our form using the form id and triggering it's reset feature
        $("#add-contact-form").trigger("reset");
      }
    }

    //[STEP 5]: Send our ajax request over to the DB and print response of the RESTDB storage to console.
    $.ajax(settings).done(function (response) {
      console.log(response);
      
      $("#contact-submit").prop( "disabled", false);
      
      //@TODO update frontend UI 
      $("#add-update-msg").show().fadeOut(3000);

      //update our table 
      getContacts();
    });
  });//end click 


  //[STEP] 6
  //let's create a function to allow you to retrieve all the information in your contacts
  //by default we only retrieve 10 results
  function getContacts(limit = 10, all = true) {

    //[STEP 7]: Create our AJAX settings
    let settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://interactivedev-c274.restdb.io/rest/cantact",
      "method": "GET", //[cher] we will use GET to retrieve info
      "headers": {
        "content-type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      },
    }

    //[STEP 8]: Make our AJAX calls
    //Once we get the response, we modify our table content by creating the content internally. We run a loop to continously add on data
    //RESTDb/NoSql always adds in a unique id for each data, we tap on it to have our data and place it into our links 
    $.ajax(settings).done(function (response) {
      
      let content = "";

      for (var i = 0; i < response.length && i < limit; i++) {
        //console.log(response[i]);
        //[METHOD 1]
        //let's run our loop and slowly append content
        //we can use the normal string append += method
        /*
        content += "<tr><td>" + response[i].name + "</td>" +
          "<td>" + response[i].email + "</td>" +
          "<td>" + response[i].message + "</td>
          "<td>Del</td><td>Update</td</tr>";
        */

        //[METHOD 2]
        //using our template literal method using backticks
        //take note that we can't use += for template literal strings
        //we use ${content} because -> content += content 
        //we want to add on previous content at the same time
        content = `${content}<tr id='${response[i]._id}'>
        <td>${response[i].name}</td>
        <td>${response[i].email}</td>
        <td>${response[i].id}</td>
        <td>${response[i].mentor}</td>
        <td>${response[i].class}</td>
        <td>${response[i].cca}</td>
        <td><a href='#' class='delete' data-id='${response[i]._id}'>Del</a></td><td><a href='#update-contact-container' class='update' data-id='${response[i]._id}' data-class='${response[i].class}' data-name='${response[i].name}' data-email='${response[i].email}' data-mentor='${response[i].mentor}' data-cca='${response[i].cca}'  >Update</a></td></tr>`;

      }

      //[STEP 9]: Update our HTML content
      //let's dump the content into our table body
      $("#contact-list tbody").html(content);

      $("#total-contacts").html(response.length);
    });


  }

  //[STEP 10]: Create our update listener
  //here we tap onto our previous table when we click on update
  //this is a delegation feature of jquery
  //because our content is dynamic in nature, we listen in on the main container which is "#contact-list". For each row we have a class .update to help us
  $("#contact-list").on("click", ".update", function (e) {
    e.preventDefault();
    //update our update form values
    let contactName = $(this).data("name");
    let contactEmail = $(this).data("email");
    let contactCCA = $(this).data("cca");
    let contactID = $(this).data("id");
    let contactMentor = $(this).data("mentor");
    let contactClass = $(this).data("class");
    console.log($(this).data("msg"));

    //[STEP 11]: Load in our data from the selected row and add it to our update contact form 
    $("#update-contact-name").val(contactname);
    $("#update-contact-email").val(contactemail);
    $("#update-contact-cca").val(contactcca);
    $("#update-contact-id").val(contactid);
    $("#update-contact-mentor").val(contactmentor);
    $("#update-contact-class").val(contactclass);
    $("#update-contact-container").show();

  });//end contact-list listener for update function

  //[STEP 12]: Here we load in our contact form data
  //Update form listener
  $("#update-contact-submit").on("click", function (e) {
    e.preventDefault();
    //retrieve all my update form values
    let contactName = $("#update-contact-name").val();
    let contactEmail = $("#update-contact-email").val();
    let contactClass = $("#update-contact-class").val();
    let contactID = $("#update-contact-id").val();
    let contactCCA = $("#update-contact-cca").val();
    let contactMentor = $("#update-contact-mentor").val();
    console.log($("#update-contact-msg").val());
    console.log(contactMsg);

    //[STEP 12a]: We call our update form function which makes an AJAX call to our RESTDB to update the selected information
    updateForm(contactid, contactname, contactemail, contactclass, contactcca, contactmentor);
  });//end updatecontactform listener

  //[STEP 13]: function that makes an AJAX call and process it 
  //UPDATE Based on the ID chosen
  function updateForm(contactid, contactname, contactemail, contactclass, contactcca, contactmentor) {
    //@TODO create validation methods for id etc. 

    var jsondata = { "name": contactName,
      "email": contactEmail,
      "id": contactID,
      "cca": contactCCA,
      "class": contactClass,
      "mentor": contactMentor, };

    var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://interactivedev-bed4.restdb.io/rest/contact/(ObjectID)",
    "method": "DELETE",
    "headers": {
      "content-type": "application/json",
      "x-apikey": "<your CORS apikey here>",
      "cache-control": "no-cache"
    }
  }

    //[STEP 13a]: send our AJAX request and hide the update contact form
    $.ajax(settings).done(function (response) {
    console.log(response);
    });
    
  }//end updateform function

})
