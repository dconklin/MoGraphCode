(function dc_smartReduce(thisObj){

	var scriptData = {
		name: "dc_smartReduce",
		ver: "1.0"
	}

	var counter = {
		removed: 0,
		saved: 0
	}

	var unselectedItems = {
		comps: [],
		footage: []
	};

	var selectedItems = {
		comps: [],
		footage: []
	}

	var keepItems = {
		comps: [],
		footage: []
	}

	var expressions = [];
	var compList = [];

	var helpers = {
		writeMsg: function(theString,doClear){;
			if(doClear)clearOutput(); // clear the AE console.
			// can use $.writeln for debugging purposes
			writeLn(theString);
		}
	}

	function filterProject(){
		for(var i = 1; i <= app.project.numItems; ++i){
			var itm = app.project.item(i);
			switch(itm.typeName){
				case "Composition":
					if(itm.selected){
						selectedItems.comps.push(itm);
						keepItems.comps.push(itm);
					} else {
						unselectedItems.comps.push(itm);
					}
					break;
				case "Footage":
					if(itm.selected){
						selectedItems.footage.push(itm);
						keepItems.comps.push(itm);
					} else {
						unselectedItems.footage.push(itm);
					}
					break;
				case "Folder":
					break;
				default:
					helpers.writeMsg("Project item " + i + " - " + itm.typeName + " is not Composition or Footage. Skipping.",true);
					break;
			}

		}
	}

	function getLayerExpressions(theProp){
		if(theProp.numProperties > 0){
			for (var i = 1; i <= theProp.numProperties-1; ++i){
				getLayerExpressions(theProp.property(i));

			}
		}
		if(theProp.canSetExpression && theProp.expression!=""){
			expressions.push(theProp.expression);
			helpers.writeMsg("Found expression: " + theProp.expression,true);
		}

	}

	function getCompsFromExpressions(theExpression){
		var re = /(comp\(('|")).+(('|")\))/g; // matches comp("_______") with single or double quotes.
		var compExp = theExpression.match(re);
		if(compExp){ // make sure the expression matched something.
			helpers.writeMsg("Expression contains a reference to a comp. Saving expression.",true);
			compList.push(String(compExp).replace("comp(\"","").replace("\")","").replace("comp(\'","").replace("\')","")); // strip the comp(" and ") from the expression selection to get just the comp name.
		} else {
			helpers.writeMsg("No comp referenced in expression.",true);
		}
	}

	function checkUnselectedComps(){
		// loop through every unselected comp.
		for(var i = unselectedItems.comps.length-1; i >= 0; --i){
			
			var cmp = unselectedItems.comps[i];
			
			// check names of unselected comps against comps found in expressions.
			for(var j = 0; j < compList.length; ++j){
				if (cmp.name == compList[j]){
					counter.saved+=1;
					helpers.writeMsg(cmp.name + " referenced in expressions. Saving expression.",true);
					keepItems.comps.push(cmp); // add comps to 'keep items'
					unselectedItems.comps.splice(i,1); // remove from unselected items.
				}
			}
		}
	}

	function purgeComps(){

		// make sure the unselected comps aren't used by a selected comp.		
		for (var i = unselectedItems.comps.length-1; i >= 0; --i){
			var cmp = unselectedItems.comps[i];
			var used = cmp.usedIn;
			for (var j = 0; j < used.length; ++j){  // loop through all items this comp is used in.
				for(var k = 0; k < keepItems.comps.length; ++k)  // loop through all keeper comps (selected or ref'd by expression)
					if (used[j]==keepItems.comps[k]){
						helpers.writeMsg(cmp.name + " matches a comp that's being kept. Keeping this comp as well.",true);
						keepItems.comps.push(cmp);
						unselectedItems.comps.splice(i,1);
					} else {

						helpers.writeMsg("Can't find expression reference to comp " + cmp.name + ". Marking for removal.",true);
					}
			}
		}

		// now that the unselected items that have been used are removed from the unselectedItems
		// array, we can delete the items in the unselectedItems array.
		for (var i = unselectedItems.comps.length-1; i >= 0; --i){
			helpers.writeMsg("Removing composition " + unselectedItems.comps[i].name + " from project.",true);
			counter.removed+=1;
			unselectedItems.comps[i].remove();
		}

	}

	function purgeFootage(){
		for (var i = unselectedItems.footage.length-1; i >= 0; --i){
			if(unselectedItems.footage[i].usedIn.length == 0){
				helpers.writeMsg("Removing footage " + unselectedItems.footage[i].name + " from project.",true);
				counter.removed+=1;
				unselectedItems.footage[i].remove();
			}
		}
	}

	function purgeFolders(){
		for (var i = app.project.numItems; i >= 1; --i){
			if(app.project.item(i).typeName == "Folder" && app.project.item(i).numItems == 0){
				helpers.writeMsg("Removing folder " + app.project.item(i).name + " from project.",true);
				counter.removed+=1;
				app.project.item(i).remove();
			}
		}
	}

	function doReduce(){

		helpers.writeMsg("Beginning " + scriptData.name + "! Thanks for using this script!",true);
		
		filterProject(); // sort the project.

		// Loop through selected comps and extract any expressions from
		// their layers.
		for(var i = 0; i < selectedItems.comps.length; ++i){
			for (var j = 1; j <= selectedItems.comps[i].numLayers; ++j){
				helpers.writeMsg("Checking layer " + j + " of " + selectedItems.comps[i].numLayers + " in comp " + selectedItems.comps[i].name + " for expressions.",true);
				getLayerExpressions(selectedItems.comps[i].layer(j));
			}
		}

		// Loop through retrieved expressions and parse out  any comps that are
		// being referenced.
		for(var i = 0; i < expressions.length; ++i){
			getCompsFromExpressions(expressions[i]);
		}

		checkUnselectedComps(); // move any expression-referenced comps to keep items.
		purgeComps(); // remove any unused/unreferenced comps.
		purgeFootage(); // remove unused footage.
		purgeFolders(); // remove empty folders.

		helpers.writeMsg(scriptData.name + " complete! Thanks for using this script!",false);
		helpers.writeMsg("Comps saved: " + counter.saved,false);
		helpers.writeMsg("Items removed:" + counter.removed,false);

	}

	app.beginUndoGroup(scriptData.name);
	doReduce();
	app.endUndoGroup();

})(this);
