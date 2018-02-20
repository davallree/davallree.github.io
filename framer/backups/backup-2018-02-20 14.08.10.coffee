big.states.a =
	blur: 5
	
	

text.states.a =
	blur: 0

big.onTapEnd (event, layer) ->
	text.stateCycle()
	big.stateCycle()
	


# Create the constraints layer
constraints = new Layer
	width: 500
	height: 200
	x: Align.center
	y: Align.center
	opacity: 0.5


# Enable dragging, set constraints
big.draggable.enabled = true
big.draggable.constraints = constraints.frame

