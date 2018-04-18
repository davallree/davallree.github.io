Card.states.a =
	opacity: 0.99
	borderWidth: 1
	backgroundColor: "rgba(255,229,113,1)"
	width: 160
	height: 160
	x: 321
	y: 221

Card.states.c =
	shadowBlur: 40
	x: 207
	y: 107
	width: 388
	height: 388
	borderRadius: 100
	backgroundColor: "rgba(251,217,207,0.5)"
	rotation: 45
	borderWidth: 1
	shadowSpread: 1
	shadowColor: "rgba(152,147,255,0.54)"
	borderColor: "rgba(68,79,233,0)"


Card.states.b =
	y: 235
	width: 133
	height: 133
	scale: 1
	rotation: 45
	borderRadius: 20
	x: 335
	backgroundColor: "rgba(42,80,255,0.79)"
	borderWidth: 8
	borderColor: "rgba(246,211,0,1)"

	

Background.states.a =
	x: 233
	y: 134
	width: 334
	height: 334
	rotation: 90
	

Background.states.b =
	x: 191
	y: 92
	width: 419
	height: 419
	backgroundColor: "rgba(0,0,255,0.82)"
	borderWidth: 4
	borderColor: "rgba(255,238,0,1)"
	shadowSpread: 4
	shadowColor: "rgba(59,73,205,0.31)"
	shadowBlur: 40
	blur: 0
	

Background.states.c =
	borderRadius: NaN
	x: 304
	y: 205
	width: 192
	height: 192
	borderWidth: 4
	borderColor: "rgba(255,244,0,1)"
	shadowSpread: 2
	shadowColor: "rgba(255,141,0,1)"
	shadowBlur: 13
	
	
Card.states.animationOptions =
	time: 1.75
	delay: .1
	curve: Bezier.ease
	
Background.states.animationOptions =
	time: 1.75
	delay: .1
	curve: Bezier.ease

next = (n, Card) ->
	if (n > 0)
		Card.states.next()
		Card.onAnimationEnd -> 
			
			Card.off(Events.AnimationEnd)
			next(n-1, Card)

hello = (n, Background) ->
	if (n > 0)
		Background.states.next()
		Background.onAnimationEnd -> 
			
			Background.off(Events.AnimationEnd)
			next(n-1, Background)

Card.on Events.MouseUp, ->
	next(4, @)
	
Background.on Events.MouseUp, ->
	hello(4, @)
