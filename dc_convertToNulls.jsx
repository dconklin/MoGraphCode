//begin wrapper
{

	//globals
	var proj = app.project;
	var ai = proj.activeItem;

	function convertToNulls(){

		if (ai !== null){

			var sel = ai.selectedLayers;

			if (sel.length > 0){

				for (var i = 0; i <	 sel.length; i++){


					//get info from layer.
					var curIn = sel[i].inPoint;
					var curOut = sel[i].outPoint;
					var curDur = curOut - curIn;
					var curName = sel[i].name;
					var curLabel = sel[i].label;

					

					//set up null.
					var curNull = ai.layers.addNull(curDur);
						curNull.inPoint = curIn;
						curNull.name = curName + "_CONTROL";

						curNull.moveBefore(sel[i]);
						curNull.label = curLabel;
						curNull.parent = sel[i];

				} //end loop through selected layers

			} else {

				alert("Please select some layers!", "SELECT SOME LAYERS!");

			}

		} else{
			alert("Please select a comp!", "SELECT A COMP!");
		}

	} //end convert to nulls.

	app.beginUndoGroup("dc_convertToNulls");
		convertToNulls();
	app.endUndoGroup();

}