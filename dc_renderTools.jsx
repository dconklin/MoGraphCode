{

	// --------------------
	// dc_renderTools.jsx
	// --------------------

	// --------------------
	// dc_renderTools function
	// --------------------
	function dc_renderTools(thisObj){

		// --------------------
		// Global Variables
		// --------------------

		// ----- Naming Variables -----
		var scriptName = "dc_renderTools";

		// ----- ui variables -----
		var ui_rowHeight = 25;

		var shortcutList = "List of Available Shortcuts:" + "\r\n" +
		"<comp>: The name of the Composition"  + "\r\n" +
		"<proj>: The name of the Project" + "\r\n" +
		"<date>: The date in DDMMYY format."  + "\r\n" +
		"<time>: The time in HHMM format." + "\r\n" +
		"<OM>: The name of the Output Module." + "\r\n" +
		"<RS>: The name of the Render Settings." + "\r\n" +
		"<size>: The size of the comp in WxH format." + "\r\n" +
		"<width>: The width of the comp." + "\r\n" +
		"<height>: The height of the comp" + "\r\n" +
		"<fr>: The composition's Frame Rate." + "\r\n" +
		"<dur>: The compositions duration, in seconds." + "\r\n" +
		"<idx>: The index of the current item in the RQ.";

		var aboutMsg = "Thank you for using this script!" + "\r\n" +
		"This script is designed to facilitate the batch-changing of render queue " +
		"items. This script is intended to be left open or docked in the AE UI and in " +
		"order to quickly queue an item, apply a naming convention, apply the correct " +
		"templates and set the correct directory in one single click." +
		"\r\n\r\n" +
		"This script was developed by David Conklin in December 2014. Please e-mail David " +
		"at dconklin09@gmail.com with any errors, bugs or feature requests. Thank you again for " +
		"using this script!" +
		"\r\n\r\n" +
		"Legal:" + "\r\n" +
		"Copyright (c) 2014, David Conklin <dconklin09@gmail.com> " +
		"Permission to use, copy, modify, and/or distribute this software for any purpose with or without " +
		"fee is hereby granted, provided that the above copyright notice and this permission notice appear " +
		"in all copies." +
		"\r\n\r\n" +
		"THE SOFTWARE IS PROVIDED \"AS IS\" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE " +
		"INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE " +
		"FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM " +
		"LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, " +
		"ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.";


		var helpMsg = scriptName + " Usage Guide" + "\r\n" +
		"Name:" + "\r\n" +
		"Input a name to be applied to each render queue item. This script comes packed with seeveral pre-defined " +
		"shortcuts/variables which can be shown by pressing the shortcuts button. Use of the shortcut is simple; simply type " +
		"your shortcut in conjunction with custom text and the script will automatically re-format the name. For instance: " + "\r\n" +
		"<comp>_<size>_<fr>_<idx>." +
		"\r\n\r\n" +
		"Path:" + "\r\n" +
		"Use the 'Get Folder' button to navigate to a new folder. This folde is where your render queue will be updated to. You can " +
		"also enter a path in the text field manually." +
		"\r\n\r\n" +
		"Setting & Output:" + "\r\n" +
		"Use the drop down lists to select a render setting and output module template to be applied to your render queue. If you " +
		"create a new template, click the 'Refresh' button to update the list." +
		"\r\n\r\n" +
		"If you would prefer to not update one of these four settings, simply uncheck the checkbox to the left of each setting. " +
		"Thank you for using this script!"; 

		// --------------------
		// Global functions 
		// --------------------
		function writeMsg(theMsg){
			clearOutput();
			writeLn(scriptName + ":")
			writeLn(theMsg);
		}

		function getRenderPresets(){
			if (app.project.renderQueue.numItems > 0){
				return app.project.renderQueue.item(1).outputModule(1).templates;
			} else {
				return ["No Items in Render Queue.."];
			}
		}

		function getRenderSettings(){
			if(app.project.renderQueue.numItems > 0){
				return app.project.renderQueue.item(1).templates;
			} else {
				return ["No Items in Render Queue.."];
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
		// buildUI function
		// 
		// inputs: thisObj - the window if called from
		// scriptsUI folder; undefined otherwise.
		//
		// outputs: the window ui object.
		// --------------------
		function buildUI(thisObj){

			// ----- Make the window object -----
			var w = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName);

			// --------------------
			// WINDOW CONTENT
			// --------------------
			var mainGroup = w.add("group");
				mainGroup.orientation = "column";
				mainGroup.alignChildren = ["left", "center"];

				// ----- A Group for Renaming -----
				var namingGroup = mainGroup.add("panel", undefined, "", {borderStyle: "gray"});
					namingGroup.orientation = "row";
					namingGroup.alignChildren =["fill", "center"];

					var nameChkbx = namingGroup.add("checkbox")
					var nameLabel = namingGroup.add("statictext", undefined, "Name:");
					var theName = namingGroup.add("edittext", undefined, "New Name..");
					var varsBtn = namingGroup.add("button", undefined, "Shortcuts");

				// ----- A Group for setting Locations -----
				var pathGroup = mainGroup.add("panel", undefined, "", {borderStyle: "gray"});
					pathGroup.orientation = "row";
					pathGroup.alignChildren =["fill", "center"];

					var pathChkbx = pathGroup.add("checkbox")
					var pathLabel = pathGroup.add("statictext", undefined, "Path:")
					var thePath = pathGroup.add("edittext", undefined, "New Output Path..");
					var getPathBtn = pathGroup.add("button", undefined, "Get Folder");

				// ----- A group for making Render Settings -----
				var rsPresetGroup = mainGroup.add("panel", undefined, "", {borderStyle: "gray"});
					rsPresetGroup.orientation = "row";
					rsPresetGroup.alignChildren = ["fill", "center"];

					var rsPresetChkbx = rsPresetGroup.add("checkbox");
					var rsPresetLabel = rsPresetGroup.add("statictext", undefined, "Setting:");
					var theRSPresets = rsPresetGroup.add("dropdownlist", undefined, getRenderSettings());
					var refreshRSBtn = rsPresetGroup.add("button", undefined, "Refresh..");

				// ----- A group for applying an OM Preset -----
				var omPresetGroup = mainGroup.add("panel", undefined, "", {borderStyle: "gray"});
					omPresetGroup.orientation = "row";
					omPresetGroup.alignChildren = ["fill", "center"];

					var omPresetChkbx = omPresetGroup.add("checkbox");
					var omPresetLabel = omPresetGroup.add("statictext", undefined, "Output:");
					var theOMPresets = omPresetGroup.add("dropdownlist", undefined, getRenderPresets());
					var refreshOMBtn = omPresetGroup.add("button", undefined, "Refresh..");

				// ----- A group for system functions -----
				var systemsGroup = mainGroup.add("panel", undefined, "", {borderStyle: "gray"});
					systemsGroup.orientation = "row";
					systemsGroup.alignChildren = ["fill", "center"];

					var okBtn = systemsGroup.add("button", undefined, "Do It!");
					var cancelBtn = systemsGroup.add("button", undefined, "Cancel");
					var aboutBtn = systemsGroup.add("button", undefined, "About");
					var helpBtn = systemsGroup.add("button", undefined, "Help");

				//
				//
				//
				//
				//

				// --------------------
				// DEFAULT STATES
				// --------------------

				// ----- Checkbox States -----
				nameChkbx.value =
				pathChkbx.value = 
				omPresetChkbx.value =
				rsPresetChkbx.value = 1;

				// ----- Dropdown States -----
				theOMPresets.selection = 
				theRSPresets.selection = 0;

				//
				//
				//
				//
				//

				// --------------------
				// SIZING 
				// --------------------

				// ----- Size Checkboxes -----
				nameChkbx.preferredSize =
				pathChkbx.preferredSize =
				omPresetChkbx.preferredSize =
				rsPresetChkbx.preferredSize = [ui_rowHeight/2, ui_rowHeight/2];

				// ----- Size Labels -----
				nameLabel.preferredSize =
				pathLabel.preferredSize = 
				omPresetLabel.preferredSize = 
				rsPresetLabel.preferredSize = [50, ui_rowHeight]; 

				// ----- Size Edit Text / Dropdowns -----
				theName.preferredSize =
				thePath.preferredSize = 
				theOMPresets.preferredSize =
				theRSPresets.preferredSize = [250, ui_rowHeight];

				// ----- Size Buttons ------
				varsBtn.preferredSize =
				getPathBtn.preferredSize = 
				refreshOMBtn.preferredSize = 
				refreshRSBtn.preferredSize = [80, ui_rowHeight];

				// ----- Size System Buttons -----
				okBtn.preferredSize =
				cancelBtn.preferredSize =
				aboutBtn.preferredSize = 
				helpBtn.preferredSize = [98, ui_rowHeight * 1.5];


			//
			//
			//
			//
			//

			// --------------------
			// FUNCITONALITY
			// --------------------

			// ----- Main Buttons -----

			varsBtn.onClick = function(){
				alert(shortcutList);
			}

			getPathBtn.onClick = function(){
				var tempFldr = Folder.selectDialog("Select a new render destination folder.");
				if(tempFldr != null){
					thePath.text = tempFldr;
				}
			}

			refreshRSBtn.onClick = function(){
				var refreshRS_temp = rsPresetGroup.add("dropdownlist", theRSPresets.bounds, getRenderSettings());
				rsPresetGroup.remove(theRSPresets);
				theRSPresets = refreshRS_temp;
				theRSPresets.selection = 0;
				writeMsg("Render settings list updated!")
			}

			refreshOMBtn.onClick = function(){
				var refreshOM_temp = omPresetGroup.add("dropdownlist", theOMPresets.bounds, getRenderPresets());
				omPresetGroup.remove(theOMPresets);
				theOMPresets = refreshOM_temp;
				theOMPresets.selection = 0;
				writeMsg("Output Module list updated!")
			}

			// ----- Checkboxes -----

			nameChkbx.onClick = function(){
				theName.enabled = this.value;
			}

			pathChkbx.onClick = function(){
				thePath.enabled =
				getPathBtn.enabled = this.value;
			}

			rsPresetChkbx.onClick = function(){
				theRSPresets.enabled = 
				refreshRSBtn.enabled = this.value;
			}

			omPresetChkbx.onClick = function(){
				theOMPresets.enabled =
				refreshOMBtn.enabled = this.value;
			}

			// ----- System Buttons -----

			okBtn.onClick = function(){
				deciderFunction(nameChkbx.value, theName.text, pathChkbx.value, thePath.text, rsPresetChkbx.value, theRSPresets.selection, omPresetChkbx.value, theOMPresets.selection);

			}

			cancelBtn.onClick = function(){
				w.close();
			}

			aboutBtn.onClick = function(){
				alert(aboutMsg, "About " + scriptName);
			}

			helpBtn.onClick = function(){
				alert(helpMsg, scriptName + " Help");
			}

			//
			//
			//
			//
			//

			// ----- Return the window -----
			w.layout.layout(true);
			w.onResizing = w.onReize = function(){w.layout.resize();}
			w.onShow = function(){ w.minimumSize = w.size}
			return w;

		} // ----- End buildUI -----

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

		// ----- WRITES OUT THE CURRENT TIME -----
		function getCurTimeString(){
			var d = new Date();
			var hh = d.getHours();
			var mm = d.getMinutes();
			var ss = d.getSeconds();

			// ----- PAD 0s -----
			if(hh < 10){ hh = "0" + hh; }
			if(mm < 10){ mm = "0" + mm; }
			if (ss < 10){ ss = "0" + ss; }

			// ----- CONCAT STRING -----
			return String(hh) + String(mm);
		}

		// ----- WRITES OUT CURRENT DATE -----
		function getCurDateString(){
			var d = new Date();
			var dd = d.getDate();
			var mm = d.getMonth() + 1;
			var yyyy = d.getYear();

			// ----- PAD ZEROS -----
			if(dd < 10){ dd = "0" + dd; }
			if(mm < 10){ mm = "0" + mm; }
			yyyy += 1900;

			var yy = String(yyyy).substr(2);

			// ----- Concat -----
			return String(mm) + String(dd) + String(yy);
		}	

		// --------------------
		// Name formatting function
		// This function formats a name string w/ shortcuts
		// into a proper name.
		//

		// inputs:
		// theNameString - (string) - the user-input name.
		//
		// outputs:
		// the formatted string.
		// --------------------

		function makeName(theNameString, theRenderItem, theNewOM, theNewRS, theIdx){

			//shortcuts for reference
			// <comp>
			// <proj>
			// <date>
			// <time>
			// <OM>
			// <RS>
			// <size>
			// <width>
			// <height>
			// <fr>
			// <dur>
			// <idx>

			var getComp = theRenderItem.comp.name;
			var getProj = (app.project.file != null) ? app.project.file.name.split(".aep")[0] : "Unsaved Project";
			var getDate = getCurDateString();
			var getTime = getCurTimeString();
			var getOM = theNewOM.toString();
			var getRS = theNewRS.toString();
			var getSize = theRenderItem.comp.width + "x" + theRenderItem.comp.height;
			var getWidth = theRenderItem.comp.width;
			var getHeight = theRenderItem.comp.height;
			var getFR = (1/theRenderItem.comp.frameDuration).toString().replace(".", "");
			var getDur = theRenderItem.comp.duration;
			var getIdx = theIdx;
 
			theNameString = theNameString.replace("<comp>", getComp);
			theNameString = theNameString.replace("<proj>", getProj); 
			theNameString = theNameString.replace("<date>", getDate); 
			theNameString = theNameString.replace("<time>", getTime); 
			theNameString = theNameString.replace("<OM>", getOM); 
			theNameString = theNameString.replace("<RS>", getRS); 
			theNameString = theNameString.replace("<size>", getSize); 
			theNameString = theNameString.replace("<width>", getWidth); 
			theNameString = theNameString.replace("<height>", getHeight); 
			theNameString = theNameString.replace("<fr>", getFR); 
			theNameString = theNameString.replace("<dur>", getDur);
			theNameString = theNameString.replace("<idx>", getIdx);	

			return theNameString;

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
		// decider funciton 
		// This function takes the data provided
		// by the UI panel and calls the appropriate
		// functions. It also makes ensures that the
		// user is requesting something to be done.
		// 
		// Inputs:
		// doName - (boole) - 1 if renaming, 0 if not.
		// newName - (string) - the string (w/ shortcuts) of the new name.
		// doOutput - (boole) - 1 if changing outputs, 0 if not.
		// newOutput - (string) - the path of the new output
		// doRS - (boole) - 1 if updating render settings, 0 if not
		// newRS - (int) - index of which RS to use.
		// doOM - (boole) - 1 if updating output module, 0 if not.
		// newOM - (int) - index of which OM to use. 
		//
		// Outputs:
		// A message of completion.
		// --------------------

		function deciderFunction(doName, newName, doOutput, newOutput, doRS, newRS, doOM, newOM){

			// ----- Check that we're doing something -----
			if(doName == 0 && doOutput == 0 && doRS == 0 && doOM == 00){
				return alert("Please enable at least one (1) checkbox before running this script!", scriptName);
			} else {



				// ----- Something is checked -----
				// ----- Make sure soemthing is Queued -----
				if(app.project.renderQueue.numItems == 0) { 
					return alert("Please have something in the render queue before running this script!", scriptName);
				} else{

					var idxCnt = 0;

					// ----- Loop through Render Items -----
					for (var i = 1; i <= app.project.renderQueue.numItems; ++i){

						// ----- Get Current item -----
						var curItem = app.project.renderQueue.item(i);

						// ----- Check if item is queued (and updatable) -----
						if(curItem.status == RQItemStatus.QUEUED) {

							//set RS
							if(doRS == 1){

								curItem.applyTemplate(newRS);
							}

							// ----- Loop through OMs -----
							for(j = 1; j <= curItem.numOutputModules; ++j){

								++idxCnt;

								// ----- Get New Name -----
								var getNewName = makeName(newName, curItem, newOM, newRS, idxCnt);
								

								// ----- Get the current OM -----
								var curOM = curItem.outputModule(j);

								// ----- Save the old location -----
								var oldLocation = curOM.file;

								//if moving but not renaming
								if(doName == 0 && doOutput == 1){
									alert('derp')
									curItem.outputModule(j).file = new File(newOutput.toString() + "/" + oldLocation.name);
									writeMsg("Item " + i + " Output Module " + j + ": Updated Location.")
								}

								//if renaming but not moving
								if(doName == 1 && doOutput == 0){
									curItem.outputModule(j).file = new File(oldLocation.toString() + "/" + getNewName);
									writeMsg("Item " + i + " Output Module " + j + ": Updated Name.");
								}

								//if moving and renaming
								if (doName == 1 && doOutput == 1){
									curItem.outputModule(j).file = new File(newOutput.toString() + "/" + getNewName);
									writeMsg("Item " + i + " Output Module " + j + ": Updated Name and Location.");
								}

								//set OM
								if(doOM == 1){
									curItem.outputModule(j).applyTemplate(newOM);
								}

							} // end loop through OMs.

						} // end check if status queued.

					} // end loop through all RQ items.

				} // end check that something is queued

			} // end checkbox check.

		} // ----- END decicderFunction -----

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

		// ----- Make UI -----
		var theWindow = buildUI(thisObj);
		if(theWindow instanceof Window){
			theWindow.center();
			theWindow.show();
		} else {
			theWindow.layout.layout(true);
		}

	} // ----- end dc_renderTools -----

	// ----- Call dc_renderTools() ------
	dc_renderTools(this);

}