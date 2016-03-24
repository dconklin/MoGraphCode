// --------------------------------------------------
//
// About This Script
//
// Thank you for using this script! This script was designed by David Conklin in order to 
// facilitate the use of the render queue data as 'breadcrumbs' in a production environment while 
// eliminating the need to keep hundreds of old comps in your queue. 
//
// Simply put, this script gathers the comps in your render queue, whether or not they have been rendered, 
// where they were rendered to, where they were rendered and documents that information in a text file. This 
// text file is named the same thing as the AEP from which it was made to make for easy pairing and tracking.
//
// Usage is very straightforward. Use the '...' button to select a location to save the log, or use the Project Dir  
// button to automatically input your AEP directory. Once you have selected a location, simply press export. Once the 
// script is finished, the newly created text document will open.
//
// --------------------------------------------------

// --------------------------------------------------
//
//Copyright (c) 2014, David Conklin <dconklin09@gmail.com>
// Permission to use, copy, modify, and/or distribute this software for any purpose with or without 
//fee is hereby granted, provided that the above copyright notice and this permission notice appear 
//in all copies.

//THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE 
//INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE 
//FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM 
//LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, 
//ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
//
// --------------------------------------------------

{

	// --------------------
	// The main function.
	// --------------------
	function dc_logRenderQueue(thisObj){

		// --------------------
		// Global Variables
		// --------------------

		var scriptName = "dc_logRenderQueue";

		// --------------------
		// Text Variables
		// --------------------

		var aboutText = "About " + scriptName + 
						"\r\n\r\n" +
						"Thank you for using this script! This script was designed by David Conklin in order to " +
						"facilitate the use of the render queue data as 'breadcrumbs' in a production environment while " +
						"eliminating the need to keep hundreds of old comps in your queue." + 
						"\r\n\r\n" +
						"Simply put, this script gathers the comps in your render queue, whether or not they have been rendered, " +
						"where they were rendered to, where they were rendered and documents that information in a text file. This " +
						"text file is named the same thing as the AEP from which it was made to make for easy pairing and tracking." +
						"\r\n\r\n" +
						"Usage is very straightforward. Use the '...' button to select a location to save the log, or use the Project Dir " + 
						"button to automatically input your AEP directory. Once you have selected a location, simply press export. Once the " +
						"script is finished, the newly created text document will open.";


		// --------------------
		// This function build the UI.
		// Inputs: thisObj - window obj if called from scriptsUI
		// Outputs: The panel.
		// --------------------
		function buildUI(thisObj){

			// ----- Define Main Window -----
			var w = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName, undefined, {resizeable: true});

			// ----- MAKE UI GROUPS -----

			// ----- Container Group -----
			var mainGroup = w.add("group");
				mainGroup.orientation = "column";
				mainGroup.alignChildren = "fill";

				// ----- Group for File Path Stuff -----
				var filePathGroup = mainGroup.add("group");
					filePathGroup.orientation = "row";

					var getPathBtn = filePathGroup.add("button", undefined, "...");
					var getPathText = filePathGroup.add("edittext", undefined, "Path to Log Save Location.");

					getPathBtn.preferredSize = [43, 22];
					getPathText.characters = 56;

				// ----- Group for Buttons -----
				var buttonsGroup = mainGroup.add("group");
					buttonsGroup.orientation = "row";

					// buttonsGroup.alignChildren = ["fill", ""];

					var toRootBtn = buttonsGroup.add("button", undefined, "Project Dir");
					var exportBtn = buttonsGroup.add("button", undefined, "Export");
					var cancelBtn = buttonsGroup.add("button", undefined, "Cancel");
					var aboutBtn = buttonsGroup.add("button", undefined, "About");

					exportBtn.enabled = 0;

					toRootBtn.preferredSize = 
					exportBtn.preferredSize =
					cancelBtn.preferredSize = 
					aboutBtn.preferredSize = [106, 30];

			// ----- FUNCTIONALITY -----

			toRootBtn.onClick = function(){

				if (app.project != null){
					getPathText.text = String(app.project.file.parent);
					exportBtn.enabled = 1;
				}

			}

			getPathBtn.onClick = function(){

				// Set Text Box to Render Queue Log location.
				var thePath = Folder.selectDialog("Select a location to save your render queue log.");
				if (thePath != null){
					getPathText.text = String(thePath);
					exportBtn.enabled = 1;
				}

			} // end getPathBtn.onClick

			exportBtn.onClick = function(){

				app.beginSuppressDialogs();
					app.beginUndoGroup(scriptName);
					writeDoc(formatDoc(processorFunction(getRenderDetails)), getPathText.text, "txt");
					app.endUndoGroup();
				app.endSuppressDialogs(true);

			}

			cancelBtn.onClick = function(){
				w.close();
			}

			aboutBtn.onClick = function(){
				alert(aboutText, "About " + scriptName);
			}


			// ----- Layout + Resizing -----
			w.layout.layout(true);
			w.layout.resize();
			w.onResizing = w.onResize = function () {this.layout.resize();}

			w.onShow = function (){ w.minimumSize = w.size; }

			// ----- Return the window, set the layout, etc. -----
			return w;
		}

		//
		//
		//
		//
		//
		//
		//
		//
		//
		//

		// --------------------
		// HELPER FUNCTIONS
		// --------------------

		// ----- CONVERTS MILLS TO SECS/MINS/HRS -----
		function parseMills(mills){

			if (mills == null || mills == 0) { return null; }

			var secs = Math.floor(mills/1000);
			var mins = secs / 60;
			var hrs = mins/60;

			var output = Math.floor(hrs) + "h " + Math.floor((mins - (Math.floor(hrs)*60))) + "m " + Math.floor((secs - (Math.floor(mins)*60))) + "s.";

			return output;

		}

		function addMillsToDate(theDate, mills){

			if(theDate == null){ return null; }

			var secs = Math.floor(mills/1000);
			var mins = secs/60
			var hrs = mins/60

			secs = Math.floor((secs - (Math.floor(mins)*60)));
			mins = Math.floor((mins - (Math.floor(hrs)*60)));
			hrs = Math.floor(hrs);

			var baseTime = new Date(theDate);
			var addSecs = baseTime.setSeconds(baseTime.getSeconds() + secs);
			var newSecs = new Date(addSecs);
			var addMins = newSecs.setMinutes(newSecs.getMinutes() + mins);
			var newMins = new Date(addMins);
			var addHrs = newMins.setHours(newMins.getHours() + hrs);
			var output = new Date(addHrs);

			return output.toString();

		}

		//
		//
		//
		//
		//
		//
		//
		//
		//
		//

		// --------------------
		// Processer function
		// This function performs checks to make sure
		// existing project has render queue items, runs a
		// function to log the render queue, then runs a 
		// function to write the data to a file.
		//
		// INPUTS: None.
		// OUTPUTS: None.
		// --------------------
		function processorFunction(functToRun){

			var proj = app.project;

			// ----- Perform AE Checks -----
			if(proj == null) {
				alert("Please open a project before using this script.", scriptName + " Error!");
				return null;
			}

			if(proj.renderQueue.numItems == 0){
				alert("There's nothing in the render queue!", scriptName + "Error!");
				return null;
			}

			return functToRun();


		}

		//
		//
		//
		//
		//
		//
		//
		//
		//
		//

		function getRenderDetails(){

			//array data holders.
			var renderStatusArray = [];
			var renderStartArray = [];
			var renderEndArray = [];
			var renderDurArray = [];
			var renderCompArray = [];

			//this will be a 2D array.
			var renderPathArray = [];
			var renderPresetArray = [];


			for(var i = 1; i <= app.project.renderQueue.numItems; ++i){

				var curItem = app.project.renderQueue.item(i);

				//get status
				renderStatusArray.push(curItem.status);
				
				//get start time
				renderStartArray.push(curItem.startTime);
				
				//get rendering duration
				renderDurArray.push(parseMills(curItem.elapsedSeconds*1000));
				
				//compute end time
				renderEndArray.push(addMillsToDate(curItem.startTime, curItem.elapsedSeconds*1000));
				
				//get which comp was rendered.
				renderCompArray.push(curItem.comp.name);

				//holders for OM settings.
				var getFilePaths = [];
				var getPresetNames = [];
				
				//loop through output modules
				for(var j = 1; j <= curItem.numOutputModules; ++j){


					//get current output mod
					var curOM = curItem.outputModule(j);

					//get current file path and push to array.
					getFilePaths.push(curOM.file);
					getPresetNames.push(curOM.name);

				} //end loop through OMs

				//push the names/filepaths to holder arrays.;
				renderPathArray.push(getFilePaths);
				renderPresetArray.push(getPresetNames);
			
			} //end loop through RQ items

			var theReturnArray = [];
			theReturnArray[0] = renderStatusArray;
			theReturnArray[1] = renderStartArray;
			theReturnArray[2] = renderEndArray;
			theReturnArray[3] = renderDurArray;
			theReturnArray[4] = renderCompArray;
			theReturnArray[5] = renderPathArray;
			theReturnArray[6] = renderPresetArray;

			//return found data as large array.
			return theReturnArray;



		} // end getRenderDetails

		//
		//
		//
		//
		//
		//
		//
		//
		//
		//

		// -------------------
		// FormatDoc Function
		// This function takes the data acquired
		// from the render queue and formats it into
		// human-legible statements. It then formats
		// these statements into item-corresponding
		// message blocks.
		//
		// INPUTS: dataArray - a large array of data collected
		// by the getRenderDetails function.
		//
		// OUTPUTS: an array with a string/message inside of
		// each slot to be written to a text document.
		// -------------------

		function formatDoc(dataArray){

			if (dataArray == null){	return null; }

			// holder for messages
			var theMsgs = [];

			// ----- BEGINNING MESSAGE -----
			theMsgs.push("LOG CREATED AT: " + new Date().toString());
			theMsgs.push("AEP Project: " + app.project.file.name + "\r\nLocation: " + String(app.project.file.parent) + ". \r\n\r\n\r\nRender Queue Items:");				;

			// ----- GET READABLE INFO -----

			//array of strings
			var renderStatusData = dataArray[0];
			var renderStartData = dataArray[1];
			var renderEndData = dataArray[2];
			var renderDurData = dataArray[3];
			var renderCompData = dataArray[4];
			
			//2d arrays of strings.
			var renderPathData = dataArray[5];
			var renderPresetData = dataArray[6];

			// ----- GET MESSAGE COUNT -----
			var count = app.project.renderQueue.numItems;

			// ----- STRING VARIABLES -----
			var sectionDiv = "--------------------";

			// ----- HOLDER FOR CURRENT MESSAGE -----
			var curMsg = [];

			


			// ----- MAKE CONTENT FOR MESSAGE -----
			for(var i = 0; i < count; ++i){

				// ----- BEGIN SECTION -----
				curMsg.push(sectionDiv);

				// ----- HANDLE COMP -----
				curMsg.push("COMP: " + renderCompData[i] + " (Item #" + (i+1) + ")");

				// ----- HANDLE STATUS -----
				switch (renderStatusData[i]){
					case RQItemStatus.WILL_CONTINUE:
						curMsg.push("STATUS: PAUSED.");
						break;
					case RQItemStatus.NEEDS_OUTPUT:
						curMsg.push("STATUS: Needs an Output.");
						break;
					case RQItemStatus.UNQUEUED:
						curMsg.push("STATUS: UNQUEUED.");
						break;
					case RQItemStatus.QUEUED:
						curMsg.push("STATUS: QUEUED.");
						break;
					case RQItemStatus.RENDERING:
						curMsg.push("STATUS: CURRENTLY RENDERING.");
						break;
					case RQItemStatus.USER_STOPPED:
						curMsg.push("STATUS: Stopped by User.");
						break;
					case RQItemStatus.ERR_STOPPED:
						curMsg.push("STATUS: Stopped due to an Error.");
						break;
					case RQItemStatus.DONE:
						curMsg.push("STATUS: RENDERED.");
						break;
					default:
						curMsg.push("STATUS:" + String(renderStatusData[i]).split(".")[0]);
						break;

				} // end curStartLn switch

				// ------ HANDLE START TIME -----
				if (renderStartData[i] != null){
					curMsg.push("Render Start Time: " + renderStartData[i].toString());
				}

				// ------ HANDLE END TIME -----
				if (renderEndData[i] != null){
					curMsg.push("Render End Time: " + renderEndData[i].toString());
				}

				// ----- HANDLE RENDER DUR -----
				if (renderDurData[i] != null){
					curMsg.push("Render Duration: " + renderDurData[i]);
				}

				curMsg.push("\r\n" + "Render Output Paths:");

				// ----- HANDLE RENDER NAMES + PATHS -----
				for (var j = 0; j < renderPathData[i].length; ++j){

					if(renderPathData[i][j] != null){
						curMsg.push("Output " + (j+1) + ": " + renderPresetData[i][j]);
						curMsg.push(String(renderPathData[i][j]) + "\r\n");
					}

				} //end get render paths

				// ----- END SECTION -----
				curMsg.push(sectionDiv + "\r\n");


				// ----- ADD curMsg to theMsgs -----
				theMsgs.push(String(curMsg.join("\r\n")));

				// ----- CLEAR curMsg -----
				while(curMsg.length > 0) { curMsg.pop(); }

			} //end loop

			// ----- WRITE END MESSAGE -----
			theMsgs.push(" \r\n \r\n" + "Thank you for using " + scriptName + "!");


			// ----- RETURN LARGE STRING -----
			return theMsgs.join("  \r\n");

		}

		//
		//
		//
		//
		//
		//
		//
		//
		//
		//

		// --------------------
		// writeDoc function.
		// This function takes a string, a folder path
		// and an extension and writes out a file with
		// that content at that folder as that file
		// type.
		//
		// INPUTS: 
		// dataString - the string of data.
		// logFilePath - the path to the save location.
		// ext - the file extension.			
		//
		// OUTPUTS:
		// Opens the file.
		// --------------------
		function writeDoc(dataString, logFilePath, ext){

			if(dataString == null) { return; }

			var thePath = logFilePath + "/" + app.project.file.name.split(".aep")[0] + " renderQueueLog." + ext;
			var logFile = new File(thePath);

			if(logFile != null) {
				logFile.open("w");
				logFile.write(dataString);
				logFile.close();
				return logFile.execute();
			} else {
				return writeLn("Cannot save RQ Log!");
			}

		}

		//
		//
		//
		//
		//
		//
		//
		//
		//
		//

		// --------------------
		// Set the window
		// --------------------
		var theWindow = buildUI(thisObj);
		if(theWindow instanceof Window){
			theWindow.center();
			theWindow.show();
		} else{
			theWindow.layout.layout(true);
		}




	} // ----- end main function -----

	// ----- Call the main function -----
	dc_logRenderQueue(this);

}