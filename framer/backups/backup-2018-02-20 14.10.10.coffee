big.states.a =
	blur: 5
	
	

text.states.a =
	blur: 0

big.onTapEnd (event, layer) ->
	text.stateCycle()
	big.stateCycle()
	


# Create the constraints layer
constraints = new Layer
	width: 800
	height: 1000
	x: Align.center
	y: Align.center
	opacity: 0.5

# Create the constraints layer
constraints2 = new Layer
	width: 800
	height: 1000
	x: Align.center
	y: Align.center
	opacity: 0.5

# Enable dragging, set constraints
big.draggable.enabled = true
big.draggable.constraints = constraints.frame

# Enable dragging
small.draggable.enabled = true
small.draggable.enabled


