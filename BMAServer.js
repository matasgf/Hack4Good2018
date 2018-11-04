/*
Borrow My Angel Server
Frank Giddens
November 2, 2018
November 4, 2018
*/

/*
TO DO LIST
Account Creation and Authentication
Route People in Need to an Available Angel to Communicate
Integrate with an Internet-based Text Chat (Ideally Voice)
Manage Angel Availability
Maintain and Provide Searchable List of Local Resources
Maintain and Provide a BMA Blog
Provide Ability to Accept Donations Securely
Maintain and Provide Angel Training Resources
Monero Implementation
Write Presentation
*/

/*
Presentation Notes

*/

"use strict";

let fs = require("fs");
let os = require("os");
let url = require("url");
let http = require("http");
let child = require("child_process");
let io = require("socket.io");

let server;
let listener;
let port = 8080;

let waitingType = "PIN";
let waiting = [];

let getIPAddress = function(){
	let address = "127.0.0.1";
	let interfaces = os.networkInterfaces();
	for(let devName in interfaces){
		let iface = interfaces[devName];
		for(let i = 0; i < iface.length; i++){
			let alias = iface[i];
			if(alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal){
				address = alias.address
			}
		}
	}
	return address;
};

let handleRequest = function(req, res){
	let pathname = url.parse(req.url).pathname;
	if(pathname.indexOf(".") === -1){
		pathname += ".html";
	}
	if(pathname.indexOf("/") === 0){
		pathname = pathname.substr(1);
	}
	if(pathname === ".html"){
		pathname = "index.html";
	}
	fs.readFile(pathname, function(err, data){
		if(err){
			res.writeHead(404, {'Content-Type': 'text/html'});
		}
		else{
			switch(pathname.substr(pathname.lastIndexOf(".") + 1)){
				case "css":
					res.writeHead(200, {'Content-Type': 'text/css'});
					res.write(data.toString());
					break;
				case "html":
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.write(data.toString());
					break;
				case "js":
					res.writeHead(200, {'Content-Type': 'text/js'});
					res.write(data.toString());
					break;
			}
		}
		res.end();
	});
};

let init = function(){
	server = http.createServer(handleRequest);
	server.listen(port, getIPAddress());
	listener = io.listen(server);
	listener.sockets.on("connection", function(socket){
		socket.on("typeCheck", function(data){
			if(waiting.length == 0){
				waitingType = data.userType;
				waiting[waiting.length] = socket.id;
			}
			else{
				if(data.userType == waitingType){
					waiting[waiting.length] = socket.id;
				}
				else{
					socket.emit("conn", {"other" : waiting[0]});
					listener.to(waiting[0]).emit("conn", {"other" : socket.id});
					waiting.shift();
				}
			}
		});
		socket.on("message", function(data){
			listener.to(data.target).emit("message", {"mes" : data.mes});
		});
		socket.on("signupAngel", function(data){
			let angelData = data;
			angelData.userType = "Angel";
			angelData.verified = false;
			angelData.texts = 0;
			angelData.minutes = 0;
			angelData.training = {};
			angelData.training.createAccount = true;
			if(fs.existsSync("users/" + angelData.userName + ".json")){
				socket.emit("signupReceived", {"success" : false});
			}
			else{
				fs.writeFileSync("users/" + angelData.userName + ".json", JSON.stringify(angelData));
				socket.emit("signupReceived", {"success" : true});
			}
		});
		socket.on("signupPIN", function(data){
			let pinData = data;
			pinData.userType = "PIN";
			if(fs.existsSync("users/" + pinData.userName + ".json")){
				socket.emit("signupReceived", {"success" : false});
			}
			else{
				fs.writeFileSync("users/" + pinData.userName + ".json", JSON.stringify(pinData));
				socket.emit("signupReceived", {"success" : true, "user" : pinData.userName});
			}
		});
		socket.on("login", function(data){
			let successfulLogin = true;
			let tempData;
			if(fs.existsSync("users/" + data.user + ".json")){
				tempData = fs.readFileSync("users/" + data.user + ".json");
				tempData = JSON.parse(tempData);
				if(tempData.password != data.pass){
					successfulLogin = false;
				}
			}
			else{
				successfulLogin = false;
			}
			if(successfulLogin){
				switch(tempData.userType){
					case "Admin": socket.emit("AdminLogin", {"user" : tempData.userName}); break;
					case "Angel": socket.emit("AngelLogin", {"user" : tempData.userName}); break;
					case "PIN": socket.emit("PINLogin", {"user" : tempData.userName}); break;
				}
			}
			else{
				socket.emit("LoginError", {});
			}
		});
	});
	console.log("Server active at " + getIPAddress() + ":" + port);
};

init();
