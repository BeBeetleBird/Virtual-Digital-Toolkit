"use strict" ;
var toolkit = SVG("toolkit").size(window.innerWidth || 1200, window.innerHeight || 1024) ;
var rect = toolkit.rect(window.innerWidth || 1200, window.innerHeight || 1024).attr({fill : "#ebebeb"}) ;

class Vector {
    constructor(x , y){
        this.x = x ;
        this.y = y ;
    }
}

class Rect {
    constructor(x , y , w, h ){
        this.x = x ;
        this.y = y ;
        this.w = w ;
        this.h = h ;
    }    
}

class Circle {
    constructor(x,y,r) {
        this.x = x ;
        this.y = y ;
        this.r = r ;
    }
}

class Led {
    constructor(x,y,r) {
        this.circle = toolkit.circle(r).move(x,y).fill("grey") ;


    }
}
class Switch {
    constructor(x,y) {
        this.rect = toolkit.rect(20,40).move(x,y).attr({fill:"grey"}) ;
        this.slider = toolkit.rect(20,20).move(x,y).attr({fill:"green"}) ;
    }
}
class Pulsor {
    constructor() {}
}
// Ports are thep connection points for circuit in ic
class Port {
    constructor(x,y,type,name) {
        this.circle = toolkit.circle(10).move(x,y).attr({fill:"yellow"}) ;
        // this.position = new Vector(x||0,y||0) ;
        this.type = type ;
        this.name = name ;
    }
}
class Circuit {
    constructor(x,y,w,h,type) {
        // this.position = new Vector(x,y) ;
        this.rect = toolkit.rect(w,h).move(x,y).attr({fill:"red"}) ;
        
        this.gate = "" ;
        this.data = "" ;
        
        this.Connection = [] ;
    }
    Awake(icType) {
        this.rect.attr({"height" : this.data.iportLeft.length*20}) ;
        // Creating a Ports in Our IC referencing data.json
        var y = 0 , radius = 7  , xUnit = -15 , yUnit = 5;
        for(var i = 0 ; i < this.data.iportLeft.length ; i++) {
            var tempPort = new Port(this.rect.attr("x") + xUnit , this.rect.attr("y") + yUnit + y, "temp" , "temp") ;
            this.Connection.push(tempPort) ;
            y += 20 ;
        }
        xUnit = this.rect.attr("width") + 5 ;
        y = 0 ;
        for(var i = 0 ; i < this.data.iportRight.length ; i++) {
            var tempPort = new Port(this.rect.attr("x") + xUnit , this.rect.attr("y") + yUnit + y , "temp" , "temp") ;
            this.Connection.push(tempPort) ;
            y += 20 ;
        }
    }
}
class Grid {
    constructor(x,y,w,h,spacing) {
        var gridX = [];
        var gridY = [] ;
        
        for(var i = 0 ; i < h/spacing ; i++) {
            var l = toolkit.line(x||0 , y+i*spacing||0 , x+w||0 , y+i*spacing||0).stroke({width:1,color : "#d9d9d9"});
            gridX.push(l) ;
        }
        for(var i = 0 ; i < w/spacing ; i++) {
            var l = toolkit.line(x+i*spacing||0 , y||0 , x+i*spacing||0 , y+h||0).stroke({width:1,color : "#d9d9d9"});
            gridY.push(l) ;
        }
    }
}
// class Button {
//     constructor(x,y,text) {
//         this.rect = toolkit.rect(20,10).move(x,y)
//         this.text = toolkit.text(text).move(x,y) ;
//     }
// }

// public variables --------
var _led = [] ;
var _switch = [] ;
var _pulsor = [] ;
var _circuit = [] ;
var _grid ;
var _button = [] ;

window.onload = function() {
    // Maxing height and width of our control bar
    var control = document.getElementById("control").style ;
    control.width = window.innerWidth +"px";
    control.height = window.innerHeight +"px" ;

    var x , y ;
    
    // grid
    _grid = new Grid(0, 0 , window.innerWidth , window.innerHeight  , 10) ;
    
    // leds
    x = 60 ;
    for(var i = 0 ; i < 10 ; i++) {
        _led = new Led(x,30,20) ;
        x += 40 ;
    }
    
    //circuits
    x = 60 ;
    for(var i = 0 ; i < 4 ; i++) {
        var circuit = new Circuit(x,100,100,250);
        _circuit.push(circuit) ;
        x += 100+100 ;
    }
    
    //buttons
    x=60 ;
    for(var i = 0 ; i < 10 ; i++) {
        var switchTemp = new Switch(x,400);
        _switch.push(switchTemp) ;
        x += 40 ;
    }
    
//    var buttonTemp = new Button(50 , 50 , "AND Gate")
}

function CreateCircuit(type) {
    var e = window.event ;
    var tempCircuit = new Circuit(Math.round(e.clientX/10)*10 , Math.round(e.clientY/10)*10 , 80 , 250 , type) ;
    tempCircuit.data = data_JSON.gate[type] ;
    tempCircuit.Awake() ;
    
    _circuit.push(tempCircuit) ;
}



/*
function Circle ( paraX , paraY , radius) {
    this.x = paraX ;
    this.y = paraY ;
    this.radius = radius ;
    
    this.in = null ;
    this.out = null ;
    
    this.on = false ;
}

Circle.prototype.Draw = function(ctx) {
    ctx.beginPath() 
    ctx.moveTo(this.x  , this.y );
    ctx.arc(this.x, this.y , this.radius , 0 , 2*Math.PI);
    ctx.closePath() ;
    ctx.fill() ;
}
Circle.prototype.isInside = function(vec2) {
    var dx = vec2.x-this.x ;
    var dy = this.y-vec2.y ;
    
    dx *= dx ;
    dy *= dy ;
    
    var dis = Math.sqrt( dx+dy );

    if(dis > this.radius)
        return false ;
    else    
        return true ;
}

function Button( paraX , paraY , paraWidth, paraHeight ) {
    this.rect = new Rectangle(paraX , paraY , paraWidth, paraHeight) ;
    
    this.high = "#FF0000" ;    // pure red color
    this.low = "#FF9980" ;  // faint red
    
    this.on = false ;
}

Button.prototype.Draw = function(ctx) { 
    if(this.on)
        ctx.fillStyle = this.high ;
    else    
        ctx.fillStyle = this.low ;
    
    ctx.fillRect( this.rect.x ,this.rect.y ,this.rect.w ,this.rect.h );
}

function Pulsor() {
    
}

function Led(paraX , paraY , paraWidth , paraHeight) {
    this.rect = new Rectangle(paraX , paraY , paraWidth, paraHeight) ;

    this.inputs = [] ;
    var startX = paraX-5 ;
    for(var i = 0 ; i < 4 ; i++) {
        this.inputs.push(new Circle(startX , paraY+73 , 8)) ;

        startX += 20 ;
    }
}

Led.prototype.Draw = function(ctx) {
    ctx.fillStyle = "#e6e6ff" ;
    ctx.fillRect( this.rect.x ,this.rect.y ,this.rect.w ,this.rect.h );

    ctx.fillStyle = "red" ;
    ctx.font = "30px Arial" ;

    for(var i = 0 ; i < this.inputs.length ; i++) {
        this.inputs[i].Draw(ctx) ;
    }
}


function Circuit(paraX , paraY , paraWidth, paraHeight) {
    this.rect = new Rectangle(paraX , paraY , paraWidth, paraHeight) ;
    
    this.gate = "" ;
    this.data = "" ;
    this.Connection = [] ;
    
}

Circuit.prototype.Draw = function(ctx) {
    ctx.fillStyle = "#e6e6ff" ;
    ctx.fillRect( this.rect.x ,this.rect.y ,this.rect.w ,this.rect.h );
    
    ctx.fillStyle = "black" ;
    ctx.font = "30px Arial" ;
    
    if(this.data.name) {
        ctx.fillText(this.data.name , this.rect.x + 20 , this.rect.y + 30 ) ;
            
        var y = 0 , radius = 5  , xUnit = 15 ; yUnit = 50;
            
        for(var i = 0 ; i< this.Connection.length ;i++) {
//            console.log(i) ;
            this.Connection[i].Draw(ctx) ;
        }
//            ctx.fillStyle = "cyan" ;
//            for(var i = 0 ; i < this.data.iportLeft.length ; i++) {
//                if(this.data.iportLeft[i] == "GND" || this.data.iportLeft[i] == "VCC") {
//                    ctx.fillStyle = "red" ;
//                }
//                else {
//                    ctx.fillStyle = "cyan" ;
//                }
//                ctx.beginPath() 
//                ctx.moveTo(this.rect.x + radius + xUnit , this.rect.y + y + radius + yUnit);
//                ctx.arc(this.rect.x + xUnit , this.rect.y +  radius + y + yUnit, radius , 0 , 2*Math.PI);
//                ctx.closePath() ;
//                ctx.fill() ;
//                
//                y += 30 ;
//            }   
//            y = 0 ;
//            xUnit = 135 ;
//            for(var i = 0 ; i < this.data.iportRight.length ; i++) {
//                if(this.data.iportRight[i] == "GND" || this.data.iportRight[i] == "VCC") {
//                    ctx.fillStyle = "red" ;
//                }
//                else {
//                    ctx.fillStyle = "cyan" ;
//                }
//                ctx.beginPath() ;
//                ctx.moveTo(this.rect.x + radius + xUnit , this.rect.y + y + radius + yUnit);
//                ctx.arc(this.rect.x + xUnit , this.rect.y +  radius + y + yUnit, radius , 0 , 2*Math.PI);
//                ctx.closePath() ;
//                
//                ctx.fill() ;
//                
//                y += 30 ;
//            }   
    }
    else
         ctx.fillText( "none" , this.rect.x + 20 , this.rect.y + 30 ) ;
}
*/