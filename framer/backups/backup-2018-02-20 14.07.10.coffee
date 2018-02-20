big.states.a =
	blur: 5

text.states.a =
	blur: 0

big.onTapEnd (event, layer) ->
	text.stateCycle()
	big.stateCycle()
	


