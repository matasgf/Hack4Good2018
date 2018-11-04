/*
Resource Search JS
Frank Giddens
November 3, 2018
*/

"use strict";

let socket = io.connect();
let resourceCard = "";
let resourceList = [];

document.getElementById("search").addEventListener("click", function(){
	let filteredResources = [];
	let testFilters = true;
	for(let i = 0; i < resourceList.length; i++){
		if(!document.getElementById("national").checked && resourceList[i].type == "national"){
			testFilters = false;
		}
		else if(document.getElementById("city").value != "" && resourceList[i].city != document.getElementById("city").value){
			testFilters = false;
		}
		else if(document.getElementById("state").value != "--" && resourceList[i].state != document.getElementById("state").value){
			testFilters = false;
		}
		else if(document.getElementById("zipCode").value != "" && resourceList[i].zipCode != document.getElementById("zipCode").value){
			testFilters = false;
		}
		if(document.getElementById("category").value != "--" && resourceList[i].category != document.getElementById("category").value){
			testFilters = false;
		}
		if(testFilters){
			filteredResources[filteredResources.length] = resourceList[i];
		}
		testFilters = true;
	}
	document.getElementById("foundResources").innerHTML = "";
	for(i = 0; i < filteredResources.length; i++){
		resourceCard = "<div class\"card\"><h5 class\"card-title\">";
		resourceCard += filteredResources[i].group;
		resourceCard += "</h5><p class\"card-body\">Phone: ";
		resourceCard += filteredResources[i].phone;
		if(filteredResource[i].type != "national"){
			resourceCard += "<br/>";
			resourceCard += filteredResources[i].city;
			resourceCard += ", ";
			resourceCard += filteredResources[i].state;
			resourceCard += " ";
			resourceCard += filteredResources[i].zipCode;
		}
		resourceCard += "</p></div>";
	}
});

socket.on("gotResources", function(data){
	resourceList = data.resources;
});

socket.emit("getResources", {});

