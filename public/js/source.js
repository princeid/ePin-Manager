
let currentuser = localStorage.getItem("email")
$.ajax({
  url: `http://localhost:3005/carddetails?email=${currentuser}`,
  method: "get"
}).done(event => {

  for (let i = 0; i < event.length; i++) {
    $("#tbody").append(
      `<tr>
                <td>${i + 1}</td>
                <td>${event[i].number}</td>
                <td>${event[i].amount}</td>
                <td>${event[i].email}</td>
                <td>${event[i].validity}</td>
                <td>${event[i].status}</td>
                <td>
                    <button id="pay-${event[i].id}" class="pay-btn btn btn-success btn-sm" data-email="${event[i].email}" data-amount="${event[i].amount}" data-id="${event[i].id}">Pay</button>
                    <button id="upd-${event[i].id}" class="upd-btn btn btn-primary btn-sm" data-id="${event[i].id}">Update</button>
                    <button id="del-${event[i].id}" class="del-btn btn btn-danger btn-sm">Trash</button>
                </td>
            </tr>`
    );
  }

  // editButtonsEventListeners();
  // deleteButtonsEventListeners();
  payButtonsEventListeners();

  $("#search").on("click", event => {
    $.ajax({
      url: `http://localhost:3005/carddetails?email=${currentuser}`,
      method: "get"
    }).done(event => {
      $("#tbody tr").remove();

      for (let i = 0; i < event.length; i++) {
        if (
          event[i].email == $("#search-field").val() ||
          event[i].status == $("#search-field").val() ||
          event[i].amount == $("#search-field").val()
        ) {
          //event.preventDefault()

          $("#tbody").append(
            `<tr>
              <td>${i + 1}</td>
              <td>${event[i].number}</td>
              <td>${event[i].amount}</td>
              <td>${event[i].email} </td>
              <td>${event[i].validity}</td>
              <td>${event[i].status}</td>
              <td>
                <button id="pay-${event[i].id}" class="pay-btn btn btn-success btn-sm" data-email="${event[i].email}" data-amount="${event[i].amount}" data-id="${event[i].id}">Pay</button>
                <button id="upd-${event[i].id}" class="upd-btn btn btn-primary btn-sm" data-id="${event[i].id}">Update</button>
                <button id="del-${event[i].id}" class="del-btn btn btn-danger btn-sm">Trash</button>
              </td>
          </tr>`
          );

        }
      }
      editButtonsEventListeners();
      deleteButtonsEventListeners();
      payButtonsEventListeners();
    });
  });

  $("#form").submit(event => {
    event.preventDefault();
    let inOneYear = new Date();
    inOneYear.setFullYear(inOneYear.getFullYear() + 1 )
    let number = Math.floor(1000000000000000 + Math.random() * 9000000000000000)
    let amount = $("#amount").val();
    let email = localStorage.getItem("email")
    let validity = inOneYear
    let status = "invalid";
    $.ajax({
      url: `http://localhost:3005/carddetails`,
      method: "post",
      data: {
        number,
        amount,
        email,
        validity,
        status
      }
    }).done(event => {
      $("#tbody").append(
        `<tr>
                    <td></td>
                    <td>${event.number}</td>
                    <td>${event.amount}</td>
                    <td>${event.email}</td>
                    <td>${event.validity}</td>
                    <td>${event.status}</td>
                </tr>`
      );
      location.reload(true);
      $("#pin").val("");
      $("#amount").val("");
      // $("#email").val("");
    });
  });

  $(".upd-btn").on("click", event => {
    //alert("CALLING")
    let p = event.target.id.split("upd-").join("");
    newid = event.target.id.split("upd-").join("");
    // event.target.dataset.id
    // event.target.dataset.eventIds
    // console.log('id:', newid)
    //$(".hide-form").show();
    $(window).scrollTop(0);

    $.ajax({
      url: `http://localhost:3005/carddetails`,
      method: "get"
    }).done(event => {
      for (let i = 0; i < event.length; i++) {
        if(event[i].id == p && event[i].status == "valid"){
          newid = ''
          return
        }
        if (event[i].id == p) {
          $("#amount").val(`${event[i].amount}`);
          $("#email").val(`${event[i].email}`);
        }
      }
    });
  });

  $("#update").on("click", event => {
    let amount = $("#amount").val();
    $.ajax({
      url: `http://localhost:3005/carddetails/${newid}`,
      method: "patch",
      data: {
        amount
      }
    }).done(event => {
      location.reload(true);
      // $("#amount").val("");
      // $("#email").val("");
    });
  });

  $(".del-btn").on("click", event => {
    if (!confirm("Sure you want to delete this record?")) {
      return false;
    }
    let id = event.target.id.split("del-").join("");

    $.ajax({
      url: `http://localhost:3005/carddetails/${id}`,
      method: "delete"
    }).done(event => {
      location.reload(true);
    });
  });

  // SIGN IN SIGN OUT BEGINS
  $("#signin").on("click", event => {
    let email = $("#email").val();
    let password = $("#password").val();
    $.ajax({
      url: `http://localhost:3005/useraccounts`,
      method: "get"
    }).done(event => {
      for (let i = 0; i < event.length; i++) {
        if (event[i].email == email && event[i].password == password) {
          localStorage.setItem("email", email);
        }
      }
      if (window.localStorage.getItem("email") != "") {
        window.location.replace("http://localhost:3005/index.html");
      } 
      else{
        $("#invalid-login").css('visibility', 'visible');
      }
      // else {
      //   window.location.replace("http://localhost:3005/login.html");
      // }
    });
  });

  $(".sign-in-btn").on("click", event => {
    window.location.replace("http://localhost:3005/login.html");
  });

  $(".sign-out-btn").on("click", event => {
    localStorage.setItem("email", "");
    window.location.replace("http://localhost:3005/faq.html");
  });

  $("#epinmanager").on("click", event => {
    if (window.localStorage.getItem("username") != "") {
      window.location.replace("http://localhost:3005/index.html");
    } else {
      window.location.replace("http://localhost:3005/login.html");
    }
  }); //// SIGN IN SIGN OUT ENDS

  // Beginning of Register and Login Calls
  $("#reg-form").submit(event => {
    let email = $("#RegisterFormEmail").val();
    let firstname = $("#RegisterFormFirstName").val();
    let lastname = $("#RegisterFormLastName").val();
    let password = $("#RegisterFormPassword").val();
    let phone = $("#RegisterFormPhone").val();
    event.preventDefault();

    $.ajax({
      url: `http://localhost:3005/useraccounts?email=${email}`,
      method: "get"
    }).done(event => {
      if (event.length > 0) {
        return;
      }

      $.ajax({
        url: "http://localhost:3005/useraccounts",
        method: "post",
        data: {
          firstname,
          lastname,
          email,
          password,
          phone
        }
      }).done(event => {
        $(window).scrollTop(0);
        $("#success").html("Registeration Successful");
        $("#RegisterFormFirstName").val("");
        $("#RegisterFormLastName").val("");
        $("#RegisterFormEmail").val("");
        $("#RegisterFormPassword").val("");
        $("#RegisterFormPhone").val("");
      });
    });
  });
}); // End of Main

$("#RegisterFormEmail").on("keyup", event => {
  const email = event.target.value;
  $.ajax({
    url: `http://localhost:3005/useraccounts?email=${email}`,
    method: "get"
  }).done(event => {
    const errorMsg = $("#RegisterFormEmailError");
    if (event.length > 0) {
      return $("#RegFormEmail").css("visibility", "visible");
    }
    $("#RegFormEmail").css("visibility", "hidden");
  });
});

function editButtonsEventListeners() {
  $(".upd-btn").on("click", event => {
    //alert("CALLING")
    let p = event.target.id.split("upd-").join("");
    newid = event.target.id.split("upd-").join("");

    // event.target.dataset.id
    // event.target.dataset.eventIds
    // console.log('id:', newid)
    //$(".hide-form").show();
    //$(window).scrollTop(0);
    //$("#save").hide();
    //$("#update").show();

    $.ajax({
      url: `http://localhost:3005/carddetails`,
      method: "get"
    }).done(event => {
      for (let i = 0; i < event.length; i++) {
        if(event[i].id == p && event[i].status == "valid"){
          newid = ''
          return
        }
        if (event[i].id == p) {
          $("#pin").val(`${event[i].number}`);
          $("#amount").val(`${event[i].amount}`);
          $("#email").val(`${event[i].email}`);
          $("#validity").val(`${event[i].validity}`);
          $("#status").val(`${event[i].status}`);
        }
      }
    });
  });
}

function deleteButtonsEventListeners() {
  $(".del-btn").on("click", event => {
    if (!confirm("Sure you want to delete this record?")) {
      return false;
    }
    let id = event.target.id.split("del-").join("");

    $.ajax({
      url: `http://localhost:3005/carddetails/${id}`,
      method: "delete"
    }).done(event => {
      location.reload(true);
    });
  });
}


function payButtonsEventListeners() {
  $(".pay-btn").on("click", function() {
    let p = event.target.id.split("pay-").join("");
    newid = event.target.id.split("pay-").join("");

    $.ajax({
      url: `http://localhost:3005/carddetails`,
      method: "get"
    }).done(event => {
      for (let i = 0; i < event.length; i++) {
        if(event[i].id == p && event[i].status == "valid"){
          alert("Already paid for this voucher")
          return
        }
      }
      const data = $(this).data();
      const handler = PaystackPop.setup({
        key: "pk_test_7bb2c18c9524e1eac420329b96995ecdea4dc03d",
        email: data.email,
        amount: data.amount * 100,
        currency: "NGN",
        ref: "" + Math.floor(Math.random() * 1000000000 + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
        metadata: {
          custom_fields: [
            {
              display_name: "Mobile Number",
              variable_name: "mobile_number",
              value: "+2348189205469"
            }
          ]
        },
        callback: function(response) {
          alert("success. transaction ref is " + response.reference);
          status = "valid";
          $.ajax({
            url: `http://localhost:3005/carddetails/${data.id}`,
            method: "patch",
            data: {
              status
            }
          }).done(event => {
            //$(this).css('color', 'green');
            location.reload(true);
          });
        }
      });
      handler.openIframe();
    });
    });
}
