/*
Angel Signup
Frank Giddens
November 3, 2018
*/

"use strict";

let socket = io.connect();

let fields = ["userName", "password", "email", "phone", "firstName", "lastName", "maidenName", "address", "address2", "city", "state", "zipCode", "references", "reason", "crisisExperience", "volunteerExperience", "criminalHistory", "backgroundCheck", "legalDisclaimer"];

let required = [true, true, true, true, true, true, false, true, false, true, true, true, true, true, false, false, false, true, true];

document.getElementById("sendInfo").addEventListener("click", function(){
	let acceptInfo = true;
	let info = {};
	for(let i = 0; i < fields.length - 2; i++){
		if(i < fields.length - 2){
			console.log(fields[i]);
			if(required[i] && document.getElementById(fields[i]).value == ""){
				acceptInfo = false;
				//i = fields.length;
			}
			info[fields[i]] = document.getElementById(fields[i]).value;
		}
		else{
			if(document.getElementById(fields[i]).checked == false){
				acceptInfo = false;
				//i = fields.length;
			}
			else{
				info[fields[i]] = true;
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
		socket.emit("signupAngel", info);
	}
});

socket.on("signupReceived", function(data){
	if(data.success){
		location = "angelsignupsuccess.html";
	}
	else{
		alert("Username Taken");
	}
});
