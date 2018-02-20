big.states.a =
	blur: 5
	shadowSpread: 2
	shadowColor: "rgba(212,212,212,0.9)"
	shadowBlur: 60

text.states.a =
	blur: 0

big.onDrag (event, layer) ->
	text.stateCycle()
	big.stateCycle()
	
	
	
	
	


# Enable dragging
big.draggable.enabled = true

