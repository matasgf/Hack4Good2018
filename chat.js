/*
Text Chat JS
Frank Giddens
November 2, 2018
*/

"use strict";

let socket = io.connect();
let other;
let connected = false;
let messages = [];

let updateMessages = function(){
	let newCard = "";
	newCard += "<div class=\"card w-75 p-3\"><p class=\"card-body\">";
	newCard += messages[(messages.length - 1)].mes;
	newCard += "</p><div class=\"card-footer text-muted\">";
	if(messages[(messages.length - 1)].user == 0){
		newCard += "You";
	}
	else{
		newCard += "Angel";
	}
	newCard += "</div></div><br/>";
	document.getElementById("chatBox").innerHTML += newCard;
};

let sendMessage = function(){
	if(connected){
		messages[messages.length] = {"mes" : document.getElementById("messageBox").value, "user" : 0};
		socket.emit("message", {"mes" : document.getElementById("messageBox").value, "target" : other});
		document.getElementById("messageBox").value = "";
		updateMessages();
	}
};

socket.emit("typeCheck", {"userType" : "PIN"});

socket.on("conn", function(data){
	other = data.other;
	connected = true;
	document.getElementById("chatBox").innerHTML = "";
});

socket.on("message", function(data){
	messages[messages.length] = {"mes" : data.mes, "user" : 1};
	updateMessages();
});

document.getElementById("sendMessage").addEventListener("onClick", function(){
	sendMessage();
});

document.addEventListener("keyup", function(e){
	if(e.keyCode == 13){
		sendMessage();
	}
});
