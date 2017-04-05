'use strict';

let http = require('http');
let express = require('express');
let nodemailer = require("nodemailer");
let bodyParser = require('body-parser');
let app = express();
let port = Number(process.env.PORT || 5000); //:8080

app.use(bodyParser.json()); //To support JSON-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));

// Front-end Home Page
app.get('./public/', function (req, res) {
  res.sendfile('contact.html');
  console.log('NodeMailer reading console log...' + req.url);

});

// Sending mail function
app.post('/send', function (req, res) {
  if (req.body.email == "" || req.body.subject == "") {
    res.send("Error: Email & subject tidak boleh kosong");
    return false;
  }

  //Sending emails with SMTP, Configuration using SMTP setting here
  let smtpTransport = nodemailer.createTransport("SMTP", {
    service: 'Gmail',
    auth: {
      XOAuth2: {
        user: 'contact.samsulbari@gmail.com',
        clientId: '732108406475-72fvkmnt2kfng9b8u5rardhq03n886ai.apps.googleusercontent.com',
        clientSecret: 'Rmujcu3042g5esbyIRy-o4MY',
        refreshToken: '1/KxLFJz7G-wac9WhpeJg-4IM2xaiJAWhMqAJ41jGQUiQ'
      }
    }
  });
  let mailOptions = {
    from: "contact.samsulbari@gmail.com", //Sender address
    to: req.body.email, // list of reciever
    subject: req.body.subject+" -", // Subject line
    //text: "Hello World", // plain text
    html: "<b>"+req.body.description+"</b>" //html body of index.html

    // html: '<h4>Information Detail For Client</h4>'+
    //       '<ul>'+
    //       '<li>'+req.body.fullName+'</li>'+
    //       '<li>'+req.body.email+'</li>'+
    //       '<li>'+req.body.phoneNumber+'</li>'+
    //       '<li><a href="+req.body.siteUrl+">'+req.body.siteUrl+'</a></li>'+
    //       '</ul>'+
    //       '<p>'+req.body.message+'</p>'+
    //       '<p>&copy; 2017 <a href="https://www.samsulbari.com" target="_blank">Samsul Bari</a> &middot; All rights reserved.</p>'
  }
  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      res.send("Email could not send due to error: "+error);
    } else {
      res.send("Email has been sent successfuly");
    }
  });
});

let server = http.createServer(app).listen(port, function(){
  console.log("Server is running on 127.0.0.1:"+port);
});
