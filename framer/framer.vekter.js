(function(scope) {var __layer_0__ = new Layer({"height":812,"constraintValues":{"height":812,"heightFactor":1,"width":375,"widthFactor":1},"backgroundColor":"#ffffff","clip":true,"width":375});var left_finger = new Layer({"parent":__layer_0__,"name":"left finger","shadows":[{"spread":0,"x":0,"type":"box","y":2,"blur":20,"color":"#3D71FF"}],"backgroundColor":"hsl(224, 100%, 62%)","width":125,"height":564,"constraintValues":{"height":564,"centerAnchorX":0.16666666666666666,"width":125,"top":28,"centerAnchorY":0.3817733990147783},"borderRadius":{"bottomLeft":0,"topLeft":0,"bottomRight":60,"topRight":60},"blending":"multiply","clip":false,"borderStyle":"solid","y":28});var middle_finger = new Layer({"parent":__layer_0__,"name":"middle finger","shadows":[{"spread":2,"x":0,"type":"box","y":2,"blur":20,"color":"hsl(32, 100%, 62%)"}],"borderWidth":1,"backgroundColor":"hsl(36, 100%, 62%)","width":125,"x":125,"borderColor":"hsla(0, 0%, 100%, 0.28)","height":564,"constraintValues":{"left":null,"height":564,"centerAnchorX":0.5,"width":125,"bottom":-188,"top":null,"centerAnchorY":0.88423645320197042},"borderRadius":70,"blending":"multiply","clip":false,"borderStyle":"solid","y":436});var circle_middle = new Layer({"parent":__layer_0__,"name":"circle middle","shadows":[{"spread":0,"x":0,"type":"box","y":0,"blur":14,"color":"hsla(241, 78%, 51%, 0.25)"}],"backgroundColor":"rgba(0,170,255,0.5)","width":124,"x":125,"height":124,"constraintValues":{"left":null,"height":124,"centerAnchorX":0.49866666666666665,"width":124,"top":240,"centerAnchorY":0.37192118226600984},"blending":"normal","borderRadius":"100%","clip":false,"borderStyle":"solid","y":240});var right_finger = new Layer({"parent":__layer_0__,"name":"right finger","shadows":[{"spread":0,"x":0,"type":"box","y":2,"blur":20,"color":"hsl(204, 100%, 62%)"}],"backgroundColor":"hsl(173, 100%, 62%)","width":125,"x":250,"height":564,"constraintValues":{"left":null,"height":564,"centerAnchorX":0.83333333333333337,"width":125,"bottom":159,"right":0,"top":89,"centerAnchorY":0.45689655172413796},"borderRadius":70,"blending":"multiply","clip":false,"borderStyle":"solid","y":89});var Right_circle = new Layer({"parent":right_finger,"name":"Right circle","shadows":[{"spread":0,"x":0,"type":"box","y":0,"blur":14,"color":"hsla(241, 78%, 51%, 0.25)"}],"backgroundColor":"rgba(0,170,255,0.5)","width":124,"x":1,"height":124,"constraintValues":{"left":1,"height":124,"centerAnchorX":0.504,"width":124,"bottom":191,"right":0,"top":null,"centerAnchorY":0.5514184397163121},"blending":"normal","borderRadius":"100%","clip":false,"borderStyle":"solid","y":249});var circle_left = new Layer({"parent":__layer_0__,"name":"circle left","shadows":[{"spread":0,"x":0,"type":"box","y":0,"blur":14,"color":"hsla(241, 78%, 51%, 0.25)"}],"backgroundColor":"hsla(54, 100%, 50%, 0.5)","width":124,"x":1,"height":124,"constraintValues":{"left":1,"height":124,"centerAnchorX":0.16800000000000001,"width":124,"bottom":163,"top":null,"centerAnchorY":0.72290640394088668},"blending":"normal","borderRadius":"100%","clip":false,"borderStyle":"solid","y":525});var sideways = new Layer({"parent":__layer_0__,"name":"sideways","shadows":[{"spread":0,"x":0,"type":"box","y":2,"blur":20,"color":"#3D71FF"}],"backgroundColor":"hsl(324, 100%, 62%)","width":125,"x":125,"rotation":90,"height":374,"constraintValues":{"left":null,"height":374,"centerAnchorX":0.49866666666666665,"width":125,"top":-35.5,"centerAnchorY":0.18657635467980296},"borderRadius":70,"blending":"multiply","clip":false,"borderStyle":"solid","y":-35});right_finger.__framerInstanceInfo = {"framerClass":"Layer","hash":"#vekter|right_finger","targetName":"right_finger","vekterClass":"RectangleNode"};left_finger.__framerInstanceInfo = {"framerClass":"Layer","hash":"#vekter|left_finger","targetName":"left_finger","vekterClass":"RectangleNode"};circle_left.__framerInstanceInfo = {"framerClass":"Layer","hash":"#vekter|circle_left","targetName":"circle_left","vekterClass":"OvalNode"};middle_finger.__framerInstanceInfo = {"framerClass":"Layer","hash":"#vekter|middle_finger","targetName":"middle_finger","vekterClass":"RectangleNode"};__layer_0__.__framerInstanceInfo = {"hash":"#vekter|__layer_0__","vekterClass":"FrameNode","framerClass":"Layer"};circle_middle.__framerInstanceInfo = {"framerClass":"Layer","hash":"#vekter|circle_middle","targetName":"circle_middle","vekterClass":"OvalNode"};Right_circle.__framerInstanceInfo = {"framerClass":"Layer","hash":"#vekter|Right_circle","targetName":"Right_circle","vekterClass":"OvalNode"};sideways.__framerInstanceInfo = {"framerClass":"Layer","hash":"#vekter|sideways","targetName":"sideways","vekterClass":"RectangleNode"};if (scope["__vekterVariables"]) { scope["__vekterVariables"].map(function(variable) { delete scope[variable] } ) };Object.assign(scope, {left_finger, middle_finger, circle_middle, right_finger, Right_circle, circle_left, sideways});scope["__vekterVariables"] = ["left_finger", "middle_finger", "circle_middle", "right_finger", "Right_circle", "circle_left", "sideways"];if (typeof Framer.CurrentContext.layout === 'function') {Framer.CurrentContext.layout()};})(window);