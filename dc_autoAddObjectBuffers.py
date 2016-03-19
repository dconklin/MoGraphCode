import c4d

objs = []
tags = []
buffers = []

def getObjHierarchy(parent):

    children = parent.GetChildren()

    if parent.GetUp() == None:      # if this is a top level object (no parent)
        objs.append(parent)             # add it to objs list

    if len(children) == 0:              # object has no children, is bottom level.
        return;
    else:                               # object has children
        for child in children:          # Loop through children.
            objs.append(child)
            getObjHierarchy(child)      # run this function on each child









def purgeObjectBuffers(mp,rd):


    if not mp:
        return

    purgeObjectBuffers(mp.GetNext(),rd)


    # if not mp.GetNext():
    if mp.GetTypeName() == "Object Buffer":
        doc.AddUndo(c4d.UNDOTYPE_DELETE, mp)
        mp.Remove()

    rd.Message(c4d.MSG_UPDATE)
    c4d.EventAdd()










def addObjectBuffers(the_buffers,rd):

    rd[c4d.RDATA_MULTIPASS_ENABLE]= True        # Enable the Multi-Pass option
    
    for ob in the_buffers:
        buffer = c4d.BaseList2D(c4d.Zmultipass)     # New multipass.
        buffer.GetDataInstance()[c4d.MULTIPASSOBJECT_TYPE] = c4d.VPBUFFER_OBJECTBUFFER      # Type Object Buffer
        buffer.SetName("Object Buffer "+str(ob))
        buffer[c4d.MULTIPASSOBJECT_OBJECTBUFFER] = ob        
        
        rd.InsertMultipass(buffer)
        doc.AddUndo(c4d.UNDOTYPE_NEW, buffer)

    rd.Message(c4d.MSG_UPDATE)
    c4d.EventAdd()







def main():
    c4d.CallCommand(13957)                      # Clear console.

    global objs
    global tags
    global buffers

    doc = c4d.documents.GetActiveDocument()     # the active document
    topLevelObjs = doc.GetObjects()             # top-level objects.
    rd = doc.GetActiveRenderData()

    if topLevelObjs is None:
        print "No objects present in scene!"
        return

    for ob in topLevelObjs:                     # Loop through top-level objects
        getObjHierarchy(ob)                     # gather children.



    if not objs:
        print "Couldn't get child objects!"
        return

    for ob in objs:
        tags += ob.GetTags()



    if not tags:
        print "No tags found in scene!"
        return

    for tag in tags:
        tagName = tag.GetTypeName()

        if tagName == "Compositing":

            if tag[c4d.COMPOSITINGTAG_ENABLECHN0]:
                buffers.append( tag[c4d.COMPOSITINGTAG_IDCHN0] )
            if tag[c4d.COMPOSITINGTAG_ENABLECHN1]:
                buffers.append( tag[c4d.COMPOSITINGTAG_IDCHN1] )
            if tag[c4d.COMPOSITINGTAG_ENABLECHN2]:
                buffers.append( tag[c4d.COMPOSITINGTAG_IDCHN2] )
            if tag[c4d.COMPOSITINGTAG_ENABLECHN3]:
                buffers.append( tag[c4d.COMPOSITINGTAG_IDCHN3] )
            if tag[c4d.COMPOSITINGTAG_ENABLECHN4]:
                buffers.append( tag[c4d.COMPOSITINGTAG_IDCHN4] )
            if tag[c4d.COMPOSITINGTAG_ENABLECHN5]:
                buffers.append( tag[c4d.COMPOSITINGTAG_IDCHN5] )
            if tag[c4d.COMPOSITINGTAG_ENABLECHN6]:
                buffers.append( tag[c4d.COMPOSITINGTAG_IDCHN6] )
            if tag[c4d.COMPOSITINGTAG_ENABLECHN7]:
                buffers.append( tag[c4d.COMPOSITINGTAG_IDCHN7] )
            if tag[c4d.COMPOSITINGTAG_ENABLECHN8]:
                buffers.append( tag[c4d.COMPOSITINGTAG_IDCHN8] )
            if tag[c4d.COMPOSITINGTAG_ENABLECHN9]:
                buffers.append( tag[c4d.COMPOSITINGTAG_IDCHN9] )
            if tag[c4d.COMPOSITINGTAG_ENABLECHN10]:
                buffers.append( tag[c4d.COMPOSITINGTAG_IDCHN10] )
            if tag[c4d.COMPOSITINGTAG_ENABLECHN11]:
                buffers.append( tag[c4d.COMPOSITINGTAG_IDCHN11] )

    unique_buffers = list(set(buffers))
    
    doc.StartUndo()

    firstPass = rd.GetFirstMultipass()
    if rd is not None:
        purgeObjectBuffers(firstPass, rd)

    if unique_buffers is not None:
        addObjectBuffers(unique_buffers,rd)


    doc.EndUndo()




if __name__ == "__main__":
    main()