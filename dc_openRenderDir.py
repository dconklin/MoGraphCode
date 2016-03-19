import c4d
from c4d import gui
import os.path
#Welcome to the world of Python


def main():
    
    # Get current render data
    rDat = doc.GetActiveRenderData()
    
    # Get path from render data
    path = rDat[c4d.RDATA_PATH]

    # remove filename from file
    path_dir = path.split("/")
    del path_dir[-1]
    path_dir = "/".join(path_dir);

    if len(path) > 0:

        # if file exists:
        if os.path.exists(path):
            
            # open file
            return c4d.storage.ShowInFinder(path)

        if os.path.exists(path_dir):

            return c4d.storage.ShowInFinder(path_dir)


    # get multipass output
    mp = rDat[c4d.RDATA_MULTIPASS_FILENAME]

    # remove filename from file
    mp_dir = mp.split("/")
    del mp_dir[-1]
    mp_dir = "/".join(mp_dir);

    if len(mp) > 0:

        # if file exists:
        if os.path.exists(mp):
            
            # open file
            return c4d.storage.ShowInFinder(mp)

        if os.path.exists(mp_dir):

            return c4d.storage.ShowInFinder(mp_dir)


    return gui.MessageDialog("No output set for beauty or multipass, or outputs don't exist!")


if __name__=='__main__':
    main()
