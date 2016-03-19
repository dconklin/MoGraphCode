// switch 2 layers' positions.
(function layerSwitcher(){

	app.beginUndoGroup("Shuffle Layer Positions");

	var proj = app.project;
	var ai = proj.activeItem;

	if (!proj) { return alert("Please open a project!"); }
	if (!ai || !ai instanceof CompItem) { return alert("Please make sure a comp is selected!"); }

	if (ai.selectedLayers.length < 2) { return alert("Please make sure at least 2 layers are selected.")}

	//holder for positions
	var layerPositions = [];
	var parents = [];

	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min)) + min;
	}

	//loop through layers;
	for (var i = 0; i < ai.selectedLayers.length; ++i){
		l = ai.selectedLayers[i];
		
		parents.push( l.parent ); // save parent
		l.parent = null; // unparent

		layerPositions.push( l.position.value );
	}

	//assign poisition from list
	for (var i = 0; i < ai.selectedLayers.length; ++i){
		l = ai.selectedLayers[i];		
	
		var pick = getRandomInt(0, layerPositions.length);
		l.position.setValue( layerPositions.splice(pick,1)[0] );
		writeLn("Layer " + l.name + "\'s position updated.");
	
		l.parent = parents[i]; //reparent
	}

	app.endUndoGroup();


})();