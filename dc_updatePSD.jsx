/*

	Script Name: dc_UpdatePSD.
	Script Author: David Conklin
	Date: 12 February 2016

	** About this script:
	This script is used to aid in the process of relinking multi-layered PSD files.
	When a PSD is imported with layers and then renmaed, After Effects has trouble trying to auto-relink
	each of the layers. Previously, the easiest way to remedy this problem was to make a copy of PSD and 
	revert the name to be the same as when it was imported.

	However, in a production environment, when PSDs are constantly being updated, moved, etc, this solution
	was less than ideal. This script aims to help the animator re-link broken or updated PSDS.

	** How this script works:
	This script does not actually re-link PSDs. Instead, it imports a new PSD and updates composition 
	layers which use the broken PSD layers to use the new PSD as their source. Because of this, the script
	works best when dealing with 2 PSDs that have the same structure, particularly layer count and layer name.

	If layers have been renamed in the *project* panel, they will cause the script to fail. Additionally, if
	layers have been removed/added in the updated PSD, they may not import correctly. This script is mainly
	for fixing broken links, not auto-up-versioning PSDs.

	* * * * *

	Copyright (c) 2016, David Conklin <dconklin09@gmail.com>
	 Permission to use, copy, modify, and/or distribute this software for any purpose with or without 
	fee is hereby granted, provided that the above copyright notice and this permission notice appear 
	in all copies.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE 
	INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE 
	FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM 
	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, 
	ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

*/


(function dc_updatePSD(thisObj){

	//clear console
	if (app.name === "ExtendScript Toolkit") {app.clc(); } else {var estApp= BridgeTalk.getSpecifier("estoolkit"); if(estApp) {var bt = new BridgeTalk; bt.target = estApp; bt.body = "app.clc()"; bt.send(); } }

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// S C R I P T      D A T A     H E R E
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	var scriptData = {
		name: "dc_updatePSDs",
		ver: "1.0",
		debug: true, //while true, debug messages are printed to ESTK console. False disables printing.
		doCleanup: false,

		// A function to write messages to the info panel or ESTK console if and only if the
		// debug variable in scriptData is true.
		// Args:
		// 		msg - String - the message to print;
		// Returns:
		// 		The $.writeln command if scriptData.debug is true, null otherwise.
		writeMsg: function(msg){
			if(scriptData.debug){
				return writeLn(msg); // write to info panel.
				// return $.writeln(msg); // write to ESTK Console.
			} else {
				return null;
			}
		}
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// P R O J E C T     D A T A     H E R E
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	var projectData = {
		proj: app.project, // shorthand for project/
		ai: app.project.activeItem, // shorthand for active item.
		comps: [], // holder for all project comps (filled by sortProject method)
		selection: [], // holder for selected project items ""
		folders: [], // holder for all project Folders ""
		footage: [], // holder for all project footage items "".

		// this functino runs through the project and sorts each item into the above
		// categories (comps, selection, folders, footage.)
		sortProject: function(){

			scriptData.writeMsg("Running sort project method of projectData")

			//clear out old stuff;
			scriptData.writeMsg("Clearing previous holder arrays.");
			projectData.comps.length = 0;
			projectData.selection.length = 0;
			projectData.folders.length = 0;
			projectData.footage.length = 0;
			
			// holder for selected items + comps.
			var sel = [];
			var cmps = [];
			var fldrs = [];
			var ftg = [];

			//loop through project.
			for (var i = 1; i <= projectData.proj.numItems; ++i){

				scriptData.writeMsg("Loop " + i + " of " + projectData.proj.numItems + " through project.");

				//shorthand for current item.
				var itm = projectData.proj.item(i);

				scriptData.writeMsg("Current item: " + itm.name);
				
				// if item is selected, add it to holder.
				if(itm.selected){
					scriptData.writeMsg(itm.name + " is selected! adding to selection.");
					sel.push(itm);
				}

				// check which type of element the item is.
				switch(itm.typeName){
					case "Composition":
						scriptData.writeMsg(itm.name + " is a composition. Sorting..");
						cmps.push(itm);
						break;
					case "Folder":
						scriptData.writeMsg(itm.name + " is a Folder. Sorting..");
						fldrs.push(itm);
						break;
					case "Footage":
						scriptData.writeMsg(itm.name + " is footage. Sorting..");
						ftg.push(itm);
						break;
					default:
						scriptData.writeMsg(itm.name + " is of unknown type. Skipping..");
						break;
				}

			} // end loop through project.

			// push data to object
			scriptData.writeMsg("projectData.sortProject finished. Pushing items back to projectData object.");
			projectData.comps = cmps;
			projectData.selection = sel;
			projectData.folders = fldrs;
			projectData.footage = ftg;

		}
	};

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// F I L E S     O B J E C T     H E R E
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	var files = {
		oldFile: null,
		newFile: null,
		unfixedFiles: [],
		
		// Check whether a file is a PSD or not.
		// Args:
		//		theFile - File Object - the file to Check.
		// Returns:
		//		true if the file has the PSD (case insensitive) extension, false otherwise.
		checkPSD: function(theFile){

			// scriptData.writeMsg("checkPSD function running on file " + theFile.name);

			// fallback for folder navigation.
			if (theFile.constructor.name == "Folder"){
				return true;
			}

			var ext = theFile.name.split(".").pop().toString().toLowerCase();
			
			if (ext == "psd"){
				// scriptData.writeMsg("Found a PSD. Import allowed.");
				return true;
			} else {
				// scriptData.writeMsg("File is not a PSD. Import denied.");
				return false;
			}

		},

		// Find other project items which share the source with provided file.
		// Useful for finding other layers from a single PSD file.
		// Args:
		//		theItm - Project item Object - the file whose source is used to check against.
		// Returns:
		// 		An array of items which have the same source as theFile.
		gatherSameSource: function(theItm){

			scriptData.writeMsg("starting gatherSameSource()");
			
			var src = theItm.mainSource.file;
			var foundItems = [];
			
			for(var i = 0; i < projectData.footage.length; ++i){
				var curItm = projectData.footage[i];
				if (curItm.mainSource.file.toString() == src.toString()){
					scriptData.writeMsg("Match!");
					foundItems.push(curItm);
				}
			}

			return foundItems;
		},

		// Find instances of a project item in comps. Useful for collecting every
		// usage of a specific asset.
		// Args:
		//		theItem - Project Item Object - the item to locate.
		// Returns:
		//		An array of Layer Objects which use theItem as their source.
		gatherLayersWithSource: function(theItem){

			var lyrs = [];

			for(var i = 0; i < projectData.comps.length; ++i){
				var cmp = projectData.comps[i];
				for(var j = 1; j <= cmp.numLayers; ++j){
					if ( cmp.layer(j).source == theItem ){
						lyrs.push(cmp.layer(j));
					}
				}
			}

			return lyrs;

		},

		// Clean up the project by removing empty folders and compositons.
		// Args:
		//		None.
		// Returns:
		//		Nothing.
		cleanup: function(){

			var cmpCount = 0;
			var fldrCount = 0;

			// Clean up empty comps.
			for(var i = projectData.comps.length-1; i >= 0; --i){
				if(projectData.comps[i].numLayers == 0){
					++cmpCount;
					projectData.comps[i].remove();
				}
			}

			// Clean up empty folders.
			for(var i = projectData.folders.length-1; i >= 0; --i){
				if(projectData.folders[i].numItems == 0){
					++fldrCount;
					projectData.folders[i].remove();
				}
			}

			return scriptData.writeMsg("Cleanup finished. " + cmpCount + " empty comps and " + fldrCount + " empty folders cleaned up.");

		}

	};

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// P S D     H O L D E R     O B J E C T     H E R E
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	// This will hold data which links the old PSD files to the new ones.
	// Format is {old project item: new project item}
	var psds = {};

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// M A I N     S C R I P T     L O G I C     S T A R T S     H E R E
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	app.beginUndoGroup(scriptData.name);
	app.beginSuppressDialogs();

	// ----------------------------------
	// Handle selection + import of PSD.
	// ----------------------------------

	// Sort through project.
	projectData.sortProject();

	// make sure something's selected.
	if(projectData.selection.length == 0) {
		return alert("Please make sure you have at least one item selected and try again!", scriptData.name);
	}

	// make sure selected item is a psd
	if(files.checkPSD( projectData.selection[0].file ) == false){
		return alert("First selected item is not a PSD. Please make sure you have a PSD selected and try again.", scriptData.name);
	}

	// get selected file's file on disk.
	files.oldFile = projectData.selection[0];
	
	// request new file.
	files.newFile = File.openDialog("Please select a new PSD.", files.checkPSD, false);

	// fallback for user pressing cancel.
	if(!files.newFile) { return; }

	// make an import options object for the updated file.
	var io = new ImportOptions( File(files.newFile) );
	// make sure it's go layers and can import as layers.
	if (io.canImportAs(ImportAsType.COMP_CROPPED_LAYERS)){
		// set import type.
		io.importAs = ImportAsType.COMP_CROPPED_LAYERS;
	} else {
		return alert("Selected file cannot be imported as a layered composition. Please ensure that " + files.newFile.name + " is a PSD with layers available for import.", scriptData.name);
	}

	// Import the file.
	var importedPSD = projectData.proj.importFile(io);
	files.newFile = importedPSD.layer(1).source;
	importedPSD.remove(); // remove the comp (keep the layers);

	// Sort through project.
	projectData.sortProject();

	// ----------------------------------
	// Handle the pairing of the old project items to the
	// new items inside the psds object.
	// ----------------------------------	

	// find all project items made from the selected PSD.
	var itemsToUpdate = files.gatherSameSource(files.oldFile);
	var newItems = files.gatherSameSource(files.newFile);;

	// link itemsToUpdate (the old items) and newItems as a key-value pair
	// inside the psds object.
	for (var i = 0; i < itemsToUpdate.length; ++i){
		scriptData.writeMsg("Loop " + i + " through itemsToUpdate");
		var oldName = itemsToUpdate[i].name.split("/")[0];
		scriptData.writeMsg("oldName is " + oldName);
		for (var j = 0; j < newItems.length; ++j){
			scriptData.writeMsg("Loop " + j + " through newItems");
			var newName = newItems[j].name.split("/")[0];
			scriptData.writeMsg("newName is " + newName);
			if (oldName == newName){
				scriptData.writeMsg("Name match found. Saving in psds object..");
				psds[itemsToUpdate[i].name] = newItems[j];
				break;
			}
		}
	}

	// ----------------------------------
	// Handle looking through the project, finding where the old items were used
	// and update them to the new items.
	// ----------------------------------
	
	// loop through project
	for (var i = 0; i < itemsToUpdate.length; ++i){

		// get layers for the current project item.
		var layersToUpdate = files.gatherLayersWithSource(itemsToUpdate[i]);
		
		// loop through layers.
		for (var j = 0; j < layersToUpdate.length; ++j){
			// update source.
			if (psds.hasOwnProperty(layersToUpdate[j].source.name)){
				layersToUpdate[j].replaceSource( psds[layersToUpdate[j].source.name], true );
			}
		}

	} 

	// ----------------------------------
	// Remove now-unused missing PSD layers.
	// ----------------------------------
	for (var i = itemsToUpdate.length-1; i >= 0; --i){
		if (files.gatherLayersWithSource(itemsToUpdate[i]).length == 0){
			itemsToUpdate[i].remove();
		} else {
			files.unfixedFiles.push(itemsToUpdate[i].name);
		}
	}

	// ----------------------------------
	// Alert for unfixed files.
	// ----------------------------------
	if (files.unfixedFiles.length > 0){
		var errorString = files.unfixedFiles.length + " files could not be fixed. It's possible they were renamed or removed from the updated PSD. For best results, use 2 PSDs which have the same number of layers with the same names.\r\n\r\nUnfixedFiles:\r\n";
		for (var i = 0; i < files.unfixedFiles.length; ++i){
			errorString += files.unfixedFiles[i] + "\r\n";
		}
		alert(errorString, scriptData.scriptName);
	}

	// ----------------------------------
	// Prompt to Clean up project?
	// ----------------------------------
	scriptData.doCleanup = confirm("PSD Import complete. Would you like to clean up empty folders and compositions project-wide?", scriptData.scriptName);

	if(scriptData.doCleanup){
		files.cleanup();
	}


	app.endSuppressDialogs(false);
	app.endUndoGroup();

})(this);