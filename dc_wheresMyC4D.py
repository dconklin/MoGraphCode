import c4d
#Welcome to the world of Python


# This simple script opens the currently actice C4D document in finder.
# Created by David Conklin

def main():

    # get filepath
    path = c4d.documents.GetActiveDocument().GetDocumentPath();

    # get filename
    fn = c4d.documents.GetActiveDocument().GetDocumentName();

    # add filename to path
    path += "/" + fn

    # open
    c4d.storage.ShowInFinder(path);



if __name__=='__main__':
    main()
