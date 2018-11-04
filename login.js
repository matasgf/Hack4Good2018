/*
Login JS
Frank Giddens
November 4, 2018
*/

"use strict";

let socket = io.connect();

document.getElementById("submit").addEventListener("click", function(){
	socket.emit("login", {"user" : document.getElementById("userName").value, "pass" : document.getElementById("password").value});
});

socket.on("AdminLogin", function(data){
	window.localStorage.type = "Admin";
	window.localStorage.user = data.user;
	location = "admindashboard.html";
});

socket.on("AngelLogin", function(data){
	window.localStorage.type = "Angel";
	window.localStorage.user = data.user;
	location = "angeldashboard.html";
});

socket.on("PINLogin", function(data){
	window.localStorage.type = "PIN";
	window.localStorage.user = data.user;
	location = "pindashboard.html";
});

socket.on("LoginError", function(data){
	alert("Incorrect Username or Password");
});
