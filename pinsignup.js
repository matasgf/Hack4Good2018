/*
PIN Signup JS
Frank Giddens
November 4, 2018
*/

"use strict";

let socket = io.connect();

let fields = ["userName", "password", "email", "firstName", "lastName", "nickname", "age", "gender", "address", "address2", "city", "state", "zipCode", "shareLocation", "pushNotifications", "allowMicrophone", "legalDisclaimer"];
let required = [true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, true];

document.getElementById("submit").addEventListener("click", function(){
	let acceptInfo = true;
	let info = {};
	for(let i = 0; i < fields.length; i++){
		console.log(fields[i]);
		if(i < fields.length - 4){
			if(required[i] && document.getElementById(fields[i]).value == ""){
				acceptInfo = false;
			}
			info[fields[i]] = document.getElementById(fields[i]).value;
		}
		else{
			if(document.getElementById(fields[i]).checked == false && i == (fields.length - 1)){
				acceptInfo = false;
			}
			else{
				info[fields[i]] = document.getElementById(fields[i]).checked;
			}
		}
	}
	if(info.userName.length < 8 || info.userName.length > 24){
		acceptInfo = false;
		alert("Invalid Username: Username must have between 8 and 24 characters");
	}
	if(info.password.length < 8 || info.password.length > 24){
		acceptInfo = false;
		alert("Invalid Password: Password must have between 8 and 24 characters");
	}
	if(info.email.indexOf("@") < 1){
		acceptInfo = false;
		window.alert("Invalid Email Address");
	}
	if(!acceptInfo){
		alert("Incomplete Form");
	}
	else{
		socket.emit("signupPIN", info);
	}
});

socket.on("signupReceived", function(data){
	if(data.success){
		localStorage.type = "PIN";
		localStorage.user = data.user;
		location = "pindashboard.html";
	}
	else{
		alert("Username Taken");
	}
});
