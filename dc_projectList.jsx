// dc_projectSwitcher
// This script provides a panel which can contain multiple files and will allow for
// easy switching between them.

{
	
	function dc_projectSwitcher(thisObj){

		// import JSON2 Lib
		"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(t){return 10>t?"0"+t:t}function quote(t){return escapable.lastIndex=0,escapable.test(t)?'"'+t.replace(escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var r,n,o,f,u,p=gap,a=e[t];switch(a&&"object"==typeof a&&"function"==typeof a.toJSON&&(a=a.toJSON(t)),"function"==typeof rep&&(a=rep.call(e,t,a)),typeof a){case"string":return quote(a);case"number":return isFinite(a)?a+"":"null";case"boolean":case"null":return a+"";case"object":if(!a)return"null";if(gap+=indent,u=[],"[object Array]"===Object.prototype.toString.apply(a)){for(f=a.length,r=0;f>r;r+=1)u[r]=str(r,a)||"null";return o=0===u.length?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+p+"]":"["+u.join(",")+"]",gap=p,o}if(rep&&"object"==typeof rep)for(f=rep.length,r=0;f>r;r+=1)"string"==typeof rep[r]&&(n=rep[r],o=str(n,a),o&&u.push(quote(n)+(gap?": ":":")+o));else for(n in a)Object.prototype.hasOwnProperty.call(a,n)&&(o=str(n,a),o&&u.push(quote(n)+(gap?": ":":")+o));return o=0===u.length?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+p+"}":"{"+u.join(",")+"}",gap=p,o}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var cx,escapable,gap,indent,meta,rep;"function"!=typeof JSON.stringify&&(escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,r){var n;if(gap="",indent="","number"==typeof r)for(n=0;r>n;n+=1)indent+=" ";else"string"==typeof r&&(indent=r);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,JSON.parse=function(text,reviver){function walk(t,e){var r,n,o=t[e];if(o&&"object"==typeof o)for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(n=walk(o,r),void 0!==n?o[r]=n:delete o[r]);return reviver.call(t,e,o)}var j;if(text+="",cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();


		// ==================================================================================
		// ==================================================================================
		// ==================================================================================

		// GLOBAL VARIABLES AND SHORTCUTS

		// ==================================================================================
		// ==================================================================================
		// ==================================================================================

		var scriptName = "dc_projectList";
		var theListFile = getListFile();
		var theList = readJSONFile(theListFile);
		var theProjectNames = getProjectNames(theList);

		var aboutText = "Thank you for using this script! This script is designed to facilitate " +
						"the easy-switching between projects. Simply use the + and - buttons to " +
						"add projects to the list, then use the open and import buttons to open " +
						"or import the projects." + "\r\n\r\n" +
						"This script stores the data of your list in a JSON file located in your " + 
						"user data folder. You can import and export these JSON files using the " +
						"buttons in this settings window.";






		

		

		// ==================================================================================
		// ==================================================================================
		// ==================================================================================
		
		// LIST FUNCTIONS. FUNCTIONS DEALING WITH THE LIST JSON FILE.

		// ==================================================================================
		// ==================================================================================
		// ==================================================================================

		// ----- 
		// This function reads finds the list file in the 
		// userdata folder if one exists.
		// Arguments: None
		// Returns: A Json file if one exists, otherwise a blank json.
		// -----
		function getListFile(){

			// where the file should be, if it's not here, make this folder.
			var theFolder = new Folder(Folder.userData.fsName + "/dc_Tools/" + scriptName);
			if (!theFolder.exists) { theFolder.create() }

			// get the file location
			var theFile = new File(theFolder.fsName + "/dc_projectSwitcher_list.json");

			// check that the file exists.
			if (theFile.exists){

				// File exists. Return it.
				// theFile.execute() // open the file.
				return theFile;

			} else {

				// make an empty object as a placeholder.
				var emptyObj = {};

				// No file. Make one. Make sure
				theFile.open("w"); // open file to write.
				theFile.encoding = "UTF-8"; // set encoding
				theFile.write(JSON.stringify(emptyObj)); // write the empty object.
				theFile.close(); // close the file 
				// theFile.execute(); // open the file.

				// Return file
				return theFile;

			} // ----- End Check if File exists -----

		} // ----- End getListFile -----









		// -----
		// A function that takes a JSON file and reads it into
		// a javascript object.
		// Arguments:
		//		theJSONFile - external JSON file - the file to be read.
		// Returns:
		// 		A Javascript object containing the JSON file data.
		// -----
		function readJSONFile(theJsonFile){

			if (theJsonFile.open("r")){
				theJsonFile.encoding = "UTF-8"; // set encoding
				var myJson = theJsonFile.read(); // read in the file
				var myObj = JSON.parse(myJson); // parse the file from JSON to JS.
				theJsonFile.close(); // close file.

				//return the object
				return myObj;

			} else {
				return alert("File at " + theJsonFile.fsName + " could not be opened. Please make sure it's read enabled and that you have permission to access the file!");
			}

		} // ----- End readJSONFile -----










		// -----
		// This function writes a list file. Feed it an object to
		// be converted a JSON external file.
		// Arguments: theListObj - object - The list in object notation
		// Returns: Nothing.
		// -----
		function writeListFile(theListObj){

			// get the file
			var theListFile = new File(Folder.userData.fsName + "/dc_Tools/" + scriptName + "/dc_projectSwitcher_list.json")

			if (theListFile.open("w")){ // check that open didn't cause errors
				theListFile.encoding = "UTF-8"; // set encoding
				writeLn("Writing new JSON File."); // write to console that we're writing a file.
				theListFile.write(JSON.stringify(theListObj)); //convert JS object to JSON, write it.
				theListFile.close(); // close file.
			} // end write file.

		} // ----- End writeListFile -----










		// -----
		// A function to export the list. 
		// Arguments:
		// 		theListObj - object - A js object containing list data.
		// 		theFolder - Folder - Folder to export the list to. 
		// -----
		function exportList(theListObj, theFolder){

			// get the file.
			var theListExport = new File(theFolder.fsName + "/dc_projectSwitcher_list.json");

			// open the file
			if(theListExport.open("w")){
				theListExport.encoding = "UTF-8"; // set encoding.
				theListExport.write(JSON.stringify(theListObj)); // write the JS Obj to JSON.
				theListExport.close(); // close file.
			}

		} // ----- end exportList function -----









		// -----
		// Function to get an array of project names based on the
		// content of the projectslist object.
		// Arguments:
		// 		theObj - object - the object containing the projects.
		// Returns:
		// 		an array containing the projectNames
		// -----
		function getProjectNames(theObj){

			var theProjNamesArray = []; // empty array to hold projects

			for (var proj in theObj){ // loop through object props
				if (theObj.hasOwnProperty(proj)){
					theProjNamesArray.push(String(proj)); // add props to array
				}
			} // end loop through object props

			return theProjNamesArray; // return array

		} // ----- End getProjectNames -----









		// -----
		// function to check if object is empty
		// -----
		function checkObjectForEmpty(checkObj){
			
			// loop through object properties
			for (var key in checkObj){
				if(checkObj.hasOwnProperty(key)){
					//alert("OBJECT IS NOT EMPTY")
					return false; // there's an object prop. it's not empty.
				} 
			}

			// no props found. object is empty.
			return true;
		}














		// ==================================================================================
		// ==================================================================================
		// ==================================================================================

		// UI FUNCTIONS - FUNCTIONS THAT MAKE AND CONTROL THE USER INTERFACE

		// ==================================================================================
		// ==================================================================================
		// ==================================================================================

		// -----
		// This function builds the UI panel of the script.
		// Arguments:
		// 		thisObj - the window object (if called from ScriptsUI)
		// Returns:
		// 		the window object.
		function buildUI(thisObj){

			// ----- Main Window -----
			var w = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName);
				w.alignChildren = ['fill', 'fill'];

				w.add("statictext", undefined, "Use the + button to add a project, or use the ? button to access the settings window and import a previous list.", {multiline: true});

				// group for panel buttons
				var panelBtns = w.add("group");

					//panel buttons
					var addProjBtn = panelBtns.add("button", undefined, "+");
					var remProjBtn = panelBtns.add("button", undefined, "-");
					var settingsBtn = panelBtns.add("button", undefined, "?");

					addProjBtn.preferredSize = 
					remProjBtn.preferredSize = 
					settingsBtn.preferredSize = [80, 30] 

				// group for list of projects
				var projsListGroup = w.add("group");
					projsListGroup.alignChildren = ['fill', 'fill'];

					// project list
					var projList = projsListGroup.add("listbox", undefined, theProjectNames, {scrollable: true});
						projList.preferredSize = ['', 250]

				// group for system buttons
				var systemBtns = w.add("group");

					// system buttons
					var importBtn = systemBtns.add("button", undefined, "Import")
					var openBtn = systemBtns.add("button", undefined, "Open");
					var cancelBtn = systemBtns.add("button", undefined, "Close");

					importBtn.preferredSize =
					openBtn.preferredSize =
					cancelBtn.preferredSize = [80, 30]

					// ----- Main Window Functionality -----
				addProjBtn.onClick = function(){
					addProject();
				}

				remProjBtn.onClick = function(){

					delete theList[projList.selection];
					updateProjList(getProjectNames(theList));				

				}

				settingsBtn.onClick = function(){
					makeSettingsWindow();
				}

				importBtn.onClick = function(){

					app.project.importFile(new ImportOptions(File(theList[projList.selection])));
				}

				openBtn.onClick = function(){
					app.open(File(theList[projList.selection]));
				}

				cancelBtn.onClick = function(){

					w.close();
				}

				w.onClose = function(){
					if (checkObjectForEmpty(theList) == false){
						writeListFile(theList);  // save the list when closing the panel.
					 } else {
						writeListFile(new Object ())
					 }	
				}

				// ----- End Main Window Functionality -----

			// ----- End Main Window -----









			// ----- Make Add Project Window -----

			function addProject(){

				var addProjWindow = new Window("palette", "Add Project");

				// group for custom project
				var customProjGroup = addProjWindow.add("group");
					customProjGroup.orientation = "column";
					customProjGroup.alignChildren = ['left', 'fill']

					// Project name group
					var projNameGroup = customProjGroup.add("group");

						projNameGroup.add("statictext", undefined, "Project Name:")
						// Project Name
						var projName = projNameGroup.add("edittext", undefined, "Project Name");
							projName.characters = 32;

					// Project location group
					var projLocGroup = customProjGroup.add("group");

						projLocGroup.add("statictext", undefined, "Project Location:")

						// Project Location
						var projLoc = projLocGroup.add("edittext", undefined, "Project Location");
							projLoc.characters = 24;

						var getProjLoc = projLocGroup.add("button", undefined, "...");
							getProjLoc.preferredSize = [31, 20];

				// group for buttons
				var addProjBtns = addProjWindow.add("group");

					// button for current project
					var setCurProjBtn = addProjBtns.add("button", undefined, "Set Current");

					// button to add the project
					var addProjBtn = addProjBtns.add("button", undefined, "Add Project");
					
					// button to cancel
					var cancelAddBtn = addProjBtns.add("button", undefined, "Close");

				// ----- SHOW WINDOW -----
				addProjWindow.show();
				
				// ----- Add Project Window Functionality -----
				getProjLoc.onClick = function(){
					var getAEP = File.openDialog("Please select the location of an AEP.");
					if (getAEP != null){

						if (getAEP.fsName.split(".").pop() == "aep"){

							projName.text = getAEP.fsName.split("/").pop();
							projLoc.text = getAEP.fsName;

						} else {
							alert(getAEP.name.split(".")[0] + " is a " + getAEP.fsName.split(".").pop() + " file. Please select an AEP!")
						}

					} else {
						alert("Could not open file. Please make sure you selected something!")
					}
				}

				setCurProjBtn.onClick = function(){

					if (app.project){

						projName.text = String(app.project.file).split("/").pop();
						projLoc.text = app.project.file;

					} else {
						alert("Please open a Project!");
					}

				}

				addProjBtn.onClick = function(){

					if (new File(projLoc.text).exists){
						if(projName.text.length > 0 && projName.text != "Project Name"){
							theList[projName.text] = projLoc.text;
							updateProjList(getProjectNames(theList));
						} else {
							alert("The name \'" + projName.text + "\' is not valid. Please choose a better name.");
						}
					} else {
						alert("File at " + projLoc.text + " does not exist. Please double check that you've selected the correct file.")
					}

					
				}

				cancelAddBtn.onClick = function(){

					return addProjWindow.close();
				}

			} // ----- End Add Project Window -----









			// ----- Make Settings Window -----

			function makeSettingsWindow(){

				var settingsWindow = new Window("palette", "Settings");
					settingsWindow.alignChildren = ['fill', 'fill'];

					// group for text (about, etc)
					var aboutGroup = settingsWindow.add("group");

						aboutGroup.add("statictext", undefined, aboutText, {multiline: true});

					// group for importing and exporting lists
					var importExportListGroup = settingsWindow.add("group");

						// import list
						var importListBtn = importExportListGroup.add("button", undefined, "Import List");
						var exportListBtn = importExportListGroup.add("button", undefined, "Export List");

					// group for settings buttons (OK)
					var settingsBtns = settingsWindow.add("group");

						// button to close the window
						var closeSettings = settingsBtns.add("button", undefined, "Close");

				// ----- Show Window -----
				settingsWindow.show();

				// ----- Settings Window FUNCTIONALITY -----
				importListBtn.onClick = function(){
					var theNewList = File.openDialog("Please select a JSON file created by this script.");
					if (theNewList != null){
						theList = readJSONFile(theNewList);
						updateProjList(getProjectNames(theList));
					} else {
						alert("Could not open JSON file. Please try again and ensure a JSON file is selected.")
					}
				}

				exportListBtn.onClick = function(){
					var saveLoc = Folder.selectDialog("Please select a location to save your .JSON file.");
					if (saveLoc != null){
						exportList(theList, saveLoc);
					} 
				}

				closeSettings.onClick = function(){				
					return settingsWindow.close();
				}

			} // ----- End Make Settings Window -----









			// ----- HELPER FUNCTIONS -----
			
			function updateProjList(newArrayOfItems){
				var newList = projsListGroup.add("listbox", projList.bounds, newArrayOfItems, {scrolling: true});
				projsListGroup.remove(projList);

				projList = newList;
			}










			
			// Return window.
			w.layout.layout(true);
			return w;


		} // ----- End Build UI -----









		// ----- CALL MAIN WINDOW -----
		var theWindow = buildUI(thisObj);
		if (theWindow instanceof Window){
			theWindow.center();
			theWindow.show();
		} else {
			theWindow.layout.layout(true);
		}
		// ----- END CALL MAIN WINDOW -----











	} // ----- End dc_projectSwitcher -----

	dc_projectSwitcher(this);

}