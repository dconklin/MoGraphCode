import c4d

def main():
    doc = c4d.documents.GetActiveDocument()
    sel = doc.GetActiveObjects(0)

    if len(sel) > 0:
        for ob in sel:
            ob[c4d.ID_BASEOBJECT_VISIBILITY_EDITOR] = 2
            ob[c4d.ID_BASEOBJECT_VISIBILITY_RENDER] = 2
        c4d.EventAdd()

if __name__ == "__main__":
    main()
