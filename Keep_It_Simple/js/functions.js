function saveTextAsFile()
{
	//var textToSave = document.getElementById("inputTextToSave").value;

	var actualCopiedText = document.getElementById("inputTextToSave").value;
	var textToSave = eel.s(actualCopiedText);//Passes the text content to python program
    var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;
 
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
 
    downloadLink.click();//To download the file on clicking the "Save Text to File" button
}

// Generate an error message
function showError(message) {
	document.getElementById("copy").classList.add('bg-copy');
	document.getElementById("copy").innerHTML = message;
    setTimeout(function(){ 
	document.getElementById("copy").classList.remove('bg-copy');
	document.getElementById("copy").innerHTML = "" }, 3000);
}

//To get the time draft was saved
function getTheTime()
{
	var savedAt = new Date();
	var currentTime = savedAt.toLocaleTimeString();
	localStorage.setItem("showmytime", currentTime);
}

//To change the time
function changeTime()
{
	var newTimeStamp = localStorage.getItem("showmytime");
	document.getElementById("showStatus").innerHTML = "Saved Draft at " +  newTimeStamp;
}

// To check whether the file is saved or not
function isNoteSaved()
{
	if (!localStorage.getItem("showmytime")) {
		document.getElementById("showStatus").innerHTML = "Status: Idle";
	} else {
		document.getElementById("showStatus").innerHTML = "Saved Draft at " + localStorage.getItem("showmytime");
	}
}

//To load an external file
function isFileLoadedNow() {
	var state = localStorage.getItem("saveandload");
	if (state == 3) {
		var getTheName = localStorage.getItem("saveloadedfile");
		document.getElementById("inputFileNameToSaveAs").value =  getTheName;
		document.getElementById("showStatus").innerHTML = "Loaded text from: " + getTheName;
	}
}
 
// To destroy the created event
function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}

//Function starts from here
function mainFunc() {
    chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
}, function(selection) {
	if (selection[0] != "" && !localStorage.getItem("textstatus")) {
    document.getElementById("inputTextToSave").innerHTML = selection[0];
	var savedText10 = selection[0];
	localStorage.setItem("savedtext", savedText10);
	saveTextNow();
} else if (selection[0] != "" && localStorage.getItem("textstatus") == 2) { 
    var loadMeOld = localStorage.getItem("savedtext");
	var loadMeNew = selection[0];
	var loadMeNow = loadMeOld + "\n" + "\n" + loadMeNew;
	document.getElementById("inputTextToSave").value = loadMeNow;
	localStorage.setItem("savedtext", loadMeNow);
	getTheTime();
	changeTime();
} else {
	var loadMe = localStorage.getItem("savedtext");
	document.getElementById("inputTextToSave").value = loadMe;
}
});

}

//To load the text
function loadText() 
{
	if (!localStorage.getItem("savedtextbefore")) {
		showError("Nothing to Reload!")
	} else {
		var loadMeBefore = localStorage.getItem("savedtextbefore");
		document.querySelector('#inputTextToSave').value = loadMeBefore;
		localStorage.setItem("savedtext", loadMeBefore);
		localStorage.setItem("textstatus", 2);
		getTheTime();
		changeTime();
	}
	
}

//To clear the content area
function clearText() 
{
	if (!localStorage.getItem("savedtext") && localStorage.getItem("alreadycleared") == 5) {
		showError("Nothing to Clear!");
	} else {
		var clearMe = "";
		localStorage.clear();
		document.getElementById("inputTextToSave").value = clearMe;
		document.getElementById("inputFileNameToSaveAs").value =  "";
		document.getElementById("fileToLoad").value = "";
		document.getElementById("showStatus").innerHTML = "Status: Idle";
		localStorage.setItem("alreadycleared", 5);
	}
}

//To save the file
function saveLoadedFile()
{
	var loadedNow = document.getElementById("inputTextToSave").value;
	localStorage.setItem("saveloadedtext", loadedNow);
	localStorage.setItem("savedtext", loadedNow);
	localStorage.setItem("saveandload", 3);
}

 //To laod the copied content as a text in a file
function loadFileAsText()
{
    var fileToLoad = document.getElementById("fileToLoad").files[0];
	if(!fileToLoad) {
		showError("Nothing to Load!");
	} else {
		var fileReader = new FileReader();
		fileReader.onload = function(fileLoadedEvent) {
			var textFromFileLoaded = fileLoadedEvent.target.result;
			document.getElementById("inputTextToSave").value = textFromFileLoaded;
			saveLoadedFile();
		};
		fileReader.readAsText(fileToLoad, "UTF-8");
		var currentName = fileToLoad.name;
		document.getElementById("inputFileNameToSaveAs").value = currentName;
		localStorage.setItem("saveloadedfile", currentName);
		document.getElementById("showStatus").innerHTML = "Status: File Loaded as Draft";
	}
}

//To save the text and show the time
function saveTextNow() {
	var saveMe = document.getElementById("inputTextToSave").value;
	if (saveMe.length != null && saveMe.length != "" ) {
		localStorage.setItem("savedtext", saveMe);
		localStorage.setItem("textstatus", 2);
		getTheTime();
		changeTime();
	} else {
		showError("Nothing to Save!");
	}
}

//To save the changes if done
function saveChanges() {
    var saveMe = document.getElementById("inputTextToSave").value;
	if (saveMe.length != null && saveMe.length != "" ) {
		localStorage.setItem("savedtext", saveMe);
		getTheTime();
		changeTime();
	}
}

//To save changes before the file is edited
function saveChangesBeforeEdit() {
    var saveMe = document.getElementById("inputTextToSave").value;
	if (saveMe.length != null && saveMe.length != "" ) {
		localStorage.setItem("savedtextbefore", saveMe);
		getTheTime();
		document.getElementById("showStatus").innerHTML = "Cached at " + localStorage.getItem("showmytime") + " You can reload the text!";
	}
}

//To call the functions on click event
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#saveButton').addEventListener('click', saveTextAsFile);
  document.querySelector('#loadButton').addEventListener('click', loadFileAsText);
  document.querySelector('#loadButtonLocal').addEventListener('click', loadText);
  document.querySelector('#clearButtonLocal').addEventListener('click', clearText);
  document.querySelector('#tempSave').addEventListener('click', saveTextNow);
  document.querySelector('#inputTextToSave').addEventListener('focus', saveChangesBeforeEdit);
  document.querySelector('#inputTextToSave').addEventListener('blur', saveChanges);
  mainFunc();
  isNoteSaved();
  isFileLoadedNow();
});