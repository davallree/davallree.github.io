big.states.a =
	blur: 3
	shadowSpread: 24
	
big.states.b =
	blur: 5
	shadowSpread: 24
		

text.states.a =
	blur: 0
	
text.states.b =
	blur: 3
	
small.states.a =
	blur: 5
	shadowSpread: 24
	

big.onDrag (event, layer) ->
	text.stateCycle("a","b")
	big.stateCycle("a","b")
	
small.onDrag (event, layer) ->
	text.stateCycle("a","b")
	big.stateCycle("a","b")
	small.stateCycle()


# Create the constraints layer
constraints = new Layer
	width: 1000
	height: 1200
	x: Align.center
	y: Align.center
	opacity: 0

# Create the constraints layer
constraints2 = new Layer
	width: 600
	height: 900
	x: Align.center
	y: Align.center
	opacity: 0

# Enable dragging, set constraints
big.draggable.enabled = true
big.draggable.constraints = constraints.frame

# Enable dragging
small.draggable.enabled = true
small.draggable.constraints = constraints2.frame



ripple = require("simpleripple").ripple

