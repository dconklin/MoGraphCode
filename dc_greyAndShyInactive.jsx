//begin wrapper
{

	//globals
	var proj = app.project;
	var ai = proj.activeItem;
	var labelNo = 1;

	function greyShy(){

		if (ai !== null) {

			var theLayers = ai.layers;

			for (var i = 1; i <= theLayers.length; i++) {

				if (theLayers[i].enabled == 0){

					clearOutput();

					

					if (theLayers[i].isTrackMatte) {

						theLayers[i].name = ai.layer(theLayers[i].index + 1).name + "_MATTE";
						theLayers[i].label = (labelNo < 16) ? labelNo : labelNo % 16;
						ai.layer(theLayers[i].index + 1).label = theLayers[i].label = (labelNo < 16) ? labelNo : labelNo % 16;

						labelNo++;	

					} else {
					
						theLayers[i].shy = 1;
						theLayers[i].label = 0;
						theLayers[i].locked = 1;

					}

				} else {
					
					if (ai.layer(theLayers[i].index - 1).isTrackMatte == 0){
					
						theLayers[i].label = (labelNo < 16) ? labelNo : labelNo % 16;
						labelNo++;	
					
					} else{
					
						continue;
					
					}

				}

				

			} //end loop through layers.

			ai.hideShyLayers = 1;


		} else {
			alert("Please select a comp!");
		}


	}


	app.beginUndoGroup("dc_doGreyShy");
		greyShy();
	app.endUndoGroup();

} //end wrapper