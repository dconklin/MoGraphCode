import c4d

objs = []
tags = []

def getObjHierarchy(parent):

	children = parent.GetChildren()

	if parent.GetUp() == None:		# if this is a top level object (no parent)
		objs.append(parent)				# add it to objs list

	if len(children) == 0:				# object has no children, is bottom level.
		return;
	else:								# object has children
		for child in children:			# Loop through children.
			objs.append(child)
			getObjHierarchy(child)		# run this function on each child

def main():
	c4d.CallCommand(13957)     					# Clear console.

	doc = c4d.documents.GetActiveDocument()		# the active document
	topLevelObjs = doc.GetObjects()				# top-level objects.

	for ob in topLevelObjs:						# Loop through top-level objects
		getObjHierarchy(ob)						# gather children.

	for ob in objs:
		tags = ob.GetTags()

	for tag in tags:
		tagName = tag.GetTypeName()
		print tagName
			





if __name__ == "__main__":
	main()