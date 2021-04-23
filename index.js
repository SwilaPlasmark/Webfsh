let express = require('express');
let path = require("path");
var bodyParser = require('body-parser');   //new Need to add for post
var routes = require("./routes");
var blacklist = require("express-blacklist");
var address = require('address');
var info = require("./InfoContainer");
let app = express();
app.use(bodyParser.urlencoded({ extended: true }));  //new Need to add for post
app.use(bodyParser.json());                          //new Need to add for post
app.use(routes);
app.use(info);
app.use(blacklist.blockRequests('blacklist.txt'));
let imagePathName = "";

//app.use(express.static('./public'))
app.use('/', express.static('./'));
/*
app.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {
  // Convert key-value pairs to JSON
  // https://stackoverflow.com/a/39284735/452587
  data = data.trim().split('\n').reduce(function(obj, pair) {
    pair = pair.split('=');
    return obj[pair[0]] = pair[1], obj;
  }, {});
  console.log(data);
});
*/
app.get('/style.css', function(req, res) {
  res.sendFile(__dirname + "/public/views/WebpageStyle.css");
});

//req is info sending to server from client.
//res is info sending to client from server.

app.get("/",function(req,res) {
    res.sendFile(path.resolve((__dirname,"public/views/index.html")));
});


app.get("/Chat",function(req,res) {
    res.sendFile(path.resolve((__dirname,"public/views/chat.html")));
});

app.get("/CreateChat",function(req,res) {
    res.sendFile(path.resolve((__dirname,"public/views/chatCreation.html")));
});
app.get("/IPinfo", function (req, res) {
    res.sendFile(path.resolve((__dirname, "public/views/IPinfo.html")));
});
app.get("/Banned", function (req, res) {
    res.sendFile(path.resolve((__dirname, "public/views/BannedPage.html")));
});
app.get("/Admin", function (req, res) {
    res.sendFile(path.resolve((__dirname, "public/views/AdminPage.html")));
});


    



//below is a wrapper of http.createServer(requestHandler).listen(3000);
app.listen(3000,function() {
    console.log("started on port 3000");
});

