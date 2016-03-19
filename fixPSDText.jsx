(function fixPSDText(){
    app.beginUndoGroup("Fix PSD Text");
    var proj = app.project;
    var ai = proj.activeItem;
    
    if (proj == null) { return alert("No project!"); }
    if (ai == null || !(ai instanceof CompItem)) { return alert("Please select a composition!"); }
    if (ai.selectedLayers.length == 0) { return alert("Please select 1 or more layers!"); }

    for each (var l in ai.selectedLayers){

        if (l instanceof TextLayer) {
           
            var textDoc = l.property("ADBE Text Properties").property("ADBE Text Document");
            var myText = textDoc.value;
            var theSize = myText.fontSize;
            var theScale = l.scale.value[0] / 100;
            
            l.scale.setValue( [100,100,100] );
            myText.fontSize *= theScale;
            
            
            // add line spacing here.
            
            
            textDoc.setValue(myText);
            writeLn("Layer " + l.name + "text Updated!");
            
        } else {

             writeLn("Layer " + l.name + " is not a Text Layer. Skipping..");
            continue;
        
        }
    }

    writeLn("Fix PSD Text Finished! Layers updated: " + ai.selectedLayers.length);
    
    app.endUndoGroup();
 })();