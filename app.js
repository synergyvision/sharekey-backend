var express = require("express");
var apiRegister= require("./routes/signup");
var apiLogin= require("./routes/login");
var apiLogout= require("./routes/logout");
var apiProfile= require("./routes/profile");
var apiPost = require("./routes/posts");
var apiComments = require("./routes/comment");
var apiContacts = require("./routes/contacts");
var apiChats = require("./routes/chats");
var apiMessage = require("./routes/messages");
var apiSurveys = require("./routes/surveys");
var apiFiles = require("./routes/files");

var admin = require("firebase-admin");
var firebase = require("firebase");

var serviceAccount = require("./credentials.json");

var config = require("./credentials2.json");

firebase.initializeApp(config);

db = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vision-sharekey.firebaseio.com"
});



const firestore = admin.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);
var app = express();

app.get("/", function(req,res){
  res.send("Servidor arriba")
});

app.use("/signup", apiRegister);
app.use("/login", apiLogin);
app.use("/logout", apiLogout);
app.use("/profile",apiProfile);
app.use("/posts", apiPost);
app.use("/comments", apiComments);
app.use("/contacts",apiContacts);
app.use("/chats", apiChats);
app.use("/messages",apiMessage);
app.use("/surveys",apiSurveys);
app.use("/files", apiFiles);

app.listen(3000, function() {
    console.log("Express app started on port 3000.");
  });

