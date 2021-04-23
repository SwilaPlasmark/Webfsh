
var express = require("express");
var router = express.Router();
//var mkdirp = require('mkdirp');
const fs = require('fs');
let path = require("path");

function Chat(name, password, color, publicPath, devPath){
	this.name = name;
	this.password = password;
	this.color = color;
	this.publicPath = publicPath;
	this.devPath = devPath;
}
/*
let chat1 = {
  		name: "Global Chat 1",
  		password: "123",
  		colour: "black",
  		publicPath:(__dirname,'public/logs/GlobalChat1/DisplayedChat.txt'),
  		devPath:(__dirname,'public/logs/GlobalChat1/DevChat.txt'),
  		//profiles: { names = ["Andy" , "Steve" , "Tony" ] },
	    textLog:""
}

let chat1 = new Chat("Global Chat 1", "123", "black", 
					(__dirname,'public/logs/GlobalChat1/DisplayedChat.txt'), 
					(__dirname,'public/logs/GlobalChat1/DevChat.txt'));
let chat2 = new Chat("Global Chat 2", "123", "red", 
					(__dirname,'public/logs/GlobalChat2/DisplayedChat.txt'), 
					(__dirname,'public/logs/GlobalChat2/DevChat.txt'));
let chat3 = new Chat("Global Chat 3", "123", "blue", 
					(__dirname,'public/logs/GlobalChat3/DisplayedChat.txt'), 
					(__dirname,'public/logs/GlobalChat3/DevChat.txt'));

router.ChatContainer = [chat1, chat2, chat3]
*/
router.post('/CreateChatFunction',function(req,res) {
	let tempContainer = req.body.ChatContainer;
	fs.mkdir(path.join(__dirname, 'public/logs/' + req.body.name), (err) => {
	    if (err) {
	       //EEXIST is the error code that is given when path is arealdy there
	       //return console.error(err);
	    }
	    else{
			fs.writeFile('public/logs/' + req.body.name + '/DevChat.txt', "Enter a message to start chatting", (err) => { 
			      
			    // In case of a error throw err. 
			    if (err) throw err; 
			})
			fs.writeFile('public/logs/' + req.body.name + '/DisplayedChat.txt', "Enter a message to start chatting", (err) => { 
			      
			    // In case of a error throw err. 
			    if (err) throw err; 
			})
	    }
	});
	var inChat = false;
	tempContainer.forEach(element => {
      if(element.name == req.body.name){
        //alert("You're already in that chat");
        //console.log(element.name );
        inChat = true;
  		}
	});
	if(!inChat){
		let aNewChat = new Chat(req.body.name, "123", "blue", 
						(__dirname,'public/logs/' + req.body.name + '/DisplayedChat.txt'), 
						(__dirname,'public/logs/' + req.body.name + '/DevChat.txt'));
		//tempContainer[tempContainer.length] = aNewChat;
    	res.json({container:aNewChat});
	}

});
/*
router.get('/CreateChatButtons',function(req,res) {

    res.json({chats:router.ChatContainer});

});
*/
module.exports = router;