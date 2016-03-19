{

	app.beginUndoGroup("Make lights from Layers");

	//lights from current layers
	var proj = app.project;
	var ai = proj.activeItem;

	var sel = ai.selectedLayers;

	for(var i = 0; i < sel.length; i++){

		var curLayer = sel[i];
		var newLight = ai.layers.addLight("Lux", [0,0]);

			newLight.lightType = 4014; //for spot. use 4014 for point.

			newLight.position.setValue(curLayer.position.value);

			var theExpression = 'thisComp.layer("' + curLayer.name + '").position;'

			newLight.position.expression = theExpression;

	}

	app.endUndoGroup();
	
}