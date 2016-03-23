// dc_setStrokeCaps.jsx
// Written 2016_0322 by David Conklin


// function changeCaps()
// This function changes ALL stroke caps for selected layers.
// This is mainly useful when using presets such as ouroboros which
// create dozens of shape layer strokes which would otherwise need 
// to be changed individually.
// Arguments:
//		thisObj - object - 'this' provided by ESTK when running this script.
// Returns:
//		nothing (if script is successful), or error message if not.
(function chnageCaps(thisObj){

	var scriptName = "dc_setStrokeCaps";
	
	var proj = app.project;
	if(!proj){return alert("Please open a project before running this script!",scriptName);}
	
	var ai = proj.activeItem;
	if(!ai||!ai instanceof CompItem){return alert("Please make sure you have a comp open before running this script!",scriptName)}

	var capsChangedCount = 0; // Counter (for debugging purposes.)
	var joinsChangedCount = 0;

	// function setAllStrokeCaps()
	// This function recurses properties. When it finds a Line Cap
	// property, it sets the value to val.
	// Arguments:
	//		prop - property - the top-level property to recurse through.
	//		capVal - int - value for cap type. 1=BUTT, 2=ROUND, 3=PROJECTING
	//		joinVal - int - value for join type. 1=MITER, 2=ROUND, 3=BEVEL
	// Returns:
	//		nothing.
	function setAllStrokeCaps(prop, capVal, joinVal){

		if(prop.matchName == "ADBE Vector Stroke Line Cap"){
			prop.setValue(capVal);
			++capsChangedCount;
		}

		if(prop.matchName == "ADBE Vector Stroke Line Join"){
			prop.setValue(joinVal);
			++joinsChangedCount;
		}

		if(prop.numProperties==0){
			return
		} else {
			for(var i = 1; i <= prop.numProperties; ++i){
				setAllStrokeCaps(prop.property(i),capVal,joinVal);
			}
		}

	}

	// Check that some layers are selected.
	if(ai.selectedLayers.length < 1){return alert("Please select some layers before running this script!"),scriptName}
	
	app.beginUndoGroup(scriptName);
	// Loop through selected layers.
	for each(var lyr in ai.selectedLayers){

		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		setAllStrokeCaps(lyr,2,3) // CALL THE FUNCTION.
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	}
	app.endUndoGroup();

	// Nice job. Script successful. Print how many caps were changed.
	writeLn(scriptName + " complete!");
	writeLn("Caps changed: " + capsChangedCount + ", Joins Changed:" + joinsChangedCount);
	

})(this); 