
var express = require("express");
var router = express.Router();
let path = require("path");
var formidable = require('formidable');
var mv = require('mv');
const http = require('http');
const fs = require('fs');
var bodyParser = require('body-parser'); 
router.use(bodyParser.urlencoded({ extended: true }));  //new Need to add for post
router.use(bodyParser.json());                          //new Need to add for post
var info = require("./InfoContainer");

router.post('/fileupload', function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = __dirname + '/public/images/' + files.filetoupload.name;
      var newPathName = newpath.replace(/%/g, "");
      mv(oldpath, newPathName, function (err) {
        if (err) throw err;
      });
    });
});

router.get('/getDirPath', function(req, res){
    res.json({dir:__dirname});
})

router.get('/getTextLogText', function(req, res){
  fs.readFile(req.query.publicPath, (err, data) => {
      if (err) throw err;
      res.json({textLog:data.toString()});
  })
})
router.get('/getLoginInfoText', function(req, res){
    res.json({text:JSON.parse(fs.readFileSync('./logins.json', 'utf-8'))});
})
router.get('/getBannedIPs', function(req, res){
    res.json({text:JSON.parse(fs.readFileSync('./BannedIPs.json', 'utf-8'))});
})
router.post('/CheckBan', function(req, res){
  let jsonData = JSON.parse(fs.readFileSync('./BannedIPs.json', 'utf-8'))
  for(var i = 0; i < jsonData.Users.length; i++) {
      var obj = jsonData.Users[i];
      if(req.body.ip == obj.ip){
        res.json({banned:true});
        return;
      }
  }
  res.json({banned:false});
})
router.post('/CheckAdmin', function(req, res){
  let jsonData = JSON.parse(fs.readFileSync('./AdminIPs.json', 'utf-8'))
  //console.log(jsonData);
  for (var key of Object.keys(jsonData)) {
    if(req.body.ip == jsonData[key]){
      res.json({admin:true});
      return;
    }
  }
  res.json({admin:false});
})

router.post('/setTextLogText', function(req, res){////req.query for get, req.body for post
   fs.appendFile(req.body.publicPath, req.body.text, (err) => {
     if (err) {
        console.log(err);
      }
    });
   fs.appendFile(req.body.devPath, req.body.text + req.body.ip, (err) => {
      if (err) {
        console.log(err);
      }
    });
    res.json({default:"text"});
})
router.post('/AddIpToBanList', function(req, res){
  fs.readFile('./BannedIPs.json', 'utf8', (err, data) => {
    if (err) {
        console.log(`Error reading file from disk: ${err}`);
        res.sendStatus(500)
    } 
    else{
        // parse JSON string to JSON object
        const banned = JSON.parse(data);
        banned.Users.push({
          ip: req.body.ip
        });
        // write new data back to the file
        fs.writeFile('./BannedIPs.json', JSON.stringify(banned, null, 4), (err) => {
          if (err) {
            console.log(`Error writing file: ${err}`);
            res.sendStatus(500)
          }
        });
        res.sendStatus(200)
    }
  });
})

router.post('/clearTextLogText', function(req, res){////req.query for number, req.body for strings
    fs.writeFile(req.body.publicPath,'', (err) => {

      // In case of a error throw err.
      if (err) throw err;
  })
    res.json({default:'text'});
})
router.post('/Login', function(req, res){
  fs.readFile('./logins.json', 'utf8', (err, data) => {
    const logins = JSON.parse(data);
    logins.users.forEach(element => {
      if(element.username == req.body.name){
        element.loggedin = false
      }
    })
    let present = false
    for(var i=0; i<logins.users.length; i++){
      if(logins.users[i].username == req.body.name && logins.users[i].password == req.body.passwd){
        present = true
        logins.users[i].loggedin = true
        logins.users[i].ip = req.body.ip;
        res.sendStatus(200)
      }
    }
    fs.writeFile('./logins.json', JSON.stringify(logins, null, 4), (err) => {
      if (err) {
        console.log(`Error writing file: ${err}`);
        res.sendStatus(500)
      }
    })
    if(!present)
      res.sendStatus(403)
  });
})
router.post('/Register', function(req, res){
  fs.readFile('./logins.json', 'utf8', (err, data) => {

    if (err) {
        console.log(`Error reading file from disk: ${err}`);
        res.sendStatus(500)
    } else {

        // parse JSON string to JSON object
        const logins = JSON.parse(data);
        logins.users.forEach(element => {
          if(element.username == req.body.name){
            element.loggedin = false
          }
        })
        // add a new record
        let present = false
        logins.users.forEach(element => {
          if(element.username == req.body.name){
            present = true
            res.sendStatus(403)
          }
        });
        if(present == false){
          logins.users.push({
            username: req.body.name,
            password: req.body.passwd,
            loggedin: true,
            ip: req.body.ip
          });
          // write new data back to the file
          fs.writeFile('./logins.json', JSON.stringify(logins, null, 4), (err) => {
            if (err) {
              console.log(`Error writing file: ${err}`);
              res.sendStatus(500)
            }
          });
          res.sendStatus(200)
        }
    }
  });
})
router.get('/Chat', function(req, res){
  fs.readFile('./logins.json', 'utf8', (err, data) => {
    if (err) {
      console.log(`Error reading file from disk: ${err}`);
      res.sendStatus(500)
    } else {
      const logins = JSON.parse(data);
      let present = false
      logins.users.forEach(element => {
        if(element.username == req.query.name && element.loggedin == true){
          present = true
        }
      })
      if(!present){
        res.sendStatus(403)
      }
      else{
        res.sendFile('public/views/Chat.html', {root: __dirname })
      }
    }
  })
})
router.post("/logout", function(req, res){
  fs.readFile('./logins.json', 'utf8', (err, data) => {
    console.log('here')
    const logins = JSON.parse(data);
    logins.users.forEach(element => {
      if(element.username == req.body.name){
        element.loggedin = false
        res.sendStatus(200)
      }
    })
    fs.writeFile('./logins.json', JSON.stringify(logins, null, 4), (err) => {
      if (err) {
        console.log(`Error writing file: ${err}`);
        res.sendStatus(500)
      }
    })
  })
})
router.get('/CreateChat', function(req, res){
  fs.readFile('./logins.json', 'utf8', (err, data) => {
    if (err) {
      console.log(`Error reading file from disk: ${err}`);
      res.sendStatus(500)
    } else {
      const logins = JSON.parse(data);
      let present = false
      logins.users.forEach(element => {
        if(element.username == req.query.name && element.loggedin == true){
          present = true
        }
      })
      if(!present){
        res.sendStatus(403)
      }
      else{
        res.sendFile('public/views/chatCreation.html', {root: __dirname })
      }
    }
  })
})
module.exports = router;

