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

class Option {
    constructor(x,y,w,title,obj,rank) {
        this.rect = toolkit.rect(w,20).move(x,y).fill("#f2f2f2") ;
        this.circle = toolkit.circle(6).move(x+4,y+6.5).fill("grey") ;
        this.text = toolkit.text(title).size("12").move(x+15,y+3).fill("#999999") ;
        // this.rank = rank ;
        var t = this ;
        this.rect.on("mouseover" , function() {
            this.fill("#e6e6e6") ;
        }) ;
        this.rect.on("mouseout" , function() {
            this.fill("#f2f2f2") ;
        }) ;
        this.rect.on("click" , function() {
            obj.actions[rank](obj) ; 
            if(_menu)
                _menu.Delete() ;
        }) ;
        // this.action = action ;
    }
    get height() {
        return this.rect.attr("height") ;
    }
    Delete() {
        this.rect.remove() ;
        this.circle.remove() ;
        this.text.remove() ;
    }
}
class Menu {
    constructor(x,y,w,title) {
        this.rect = toolkit.rect(w,30).move(x,y).radius(7).fill("white") ;
        this.text = toolkit.text(title).fill("grey").size("12").move(x+5,y+3) ;
        this.options = [] ;

        this.actions = [] ;
        this.actions.push(this.Delete) ;
    }
    Add(title,obj,rank) {
        // Add a custom option
        var y = 20 ;
        for(var i = 0 ; i < this.options.length ; i++) {
            y += this.options[i].height ;
        }
        var tempOption = new Option(this.rect.attr("x")+2 ,this.rect.attr("y") + y, this.rect.attr("width")-4,title , obj , rank) ;
        this.options.push(tempOption) ;

        //Reset the height of Menu
        this.rect.attr({height: y + this.options[0].height +2}) ;
    }
    Delete(obj) {
        var t = obj || this ;
        t.rect.remove() ;
        t.text.remove() ;

        for(var i = 0 ; i < t.options.length ; i++) {
            t.options[i].Delete() ;
        }
        _menu = null ;
    }
}

class Led {
    constructor(x,y,r) {
        this.circle = toolkit.circle(r).move(x,y).fill("grey").stroke({color:"yellow" , width:3}) ;
        this.on = false ;
        this.connections = [] ;
        var t = this ;


        this.circle.on('mouseover' ,  function() {
            this.stroke({color:"orange"}) ;
        });
        this.circle.on('mouseout' ,  function() {
            this.stroke({color:"yellow"}) ;
        });

        this.circle.on('click' , function() {
            //Creates a new Wire and set it as selected else complete the connection
            if(!_selection) {
                var x = this.attr("cx") , y = this.attr("cy") ;
                var tempWire = new Wire(x , y , x , y) ;
                t.connections.push(tempWire) ;
                _selection = tempWire ;
            }
            else {
                t.connections.push(_selection) ;
                _selection = null ;
            }
        }) ;
        document.addEventListener("updateled" , function() {
            for(var i = 0 ; i < t.connections.length ; i++) {
                // console.log(t.connections[i].flow) ;
                if(t.connections[i].flow) {
                    
                    t.on = true ;
                    t.circle.fill("#00b300") ; //Dark green 006600
                    break ;
                }
                else {
                    t.on = false ;
                    t.circle.fill("#006600") ; //Darkest green
                    // break;
                }
            }
        }) ;
    }
    PlaceOver(obj) {
        obj.after(this.circle) ;
    }
}
var _menu = null ;
class Wire {
    constructor(x,y,x1,y1) {
        this.line = [] ;
        this.overlay = [] ;

        this.flow = false ;

        var tempLine = toolkit.line(x,y,x,y).stroke({width:1.5,color : "grey"}) ;
        this.line.push(tempLine) ;
        var tempOverlay = toolkit.line(x,y,x,y).stroke({width:4,color : "none"}) ;
        this.overlay.push(tempOverlay) ;

        // this.delete = false ;
        this.actions = [] ;
        this.actions.push(this.Delete) ;
    }
    // After(obj) {
    //     for(var i = 0 ; i < this.line.length ; i++) {
    //         this.line[i].after(obj) ;
    //     }
    //     // for(var i = 0 ; i < this.overlay.length ; i++) {
    //     //     this.overlay[i].after(obj) ;
    //     // }
    // }
    Update(x,y) {
        this.line[this.line.length-1].attr({x2 : x , y2 : y}) ;
        this.overlay[this.overlay.length-1].attr({x2 : x , y2 : y}) ;
    }
    Break(x,y) {
        this.Update(x,y);
        var tempLine = toolkit.line(x,y,x,y).stroke({width:1.5,color : "grey"}) ;
        var tempOverlay = toolkit.line(x,y,x,y).stroke({width:4,color:"transparent"}) ;

        var t = this ;
        tempOverlay.on("mouseover" , function() {
            if(!_selection) {
                for(var i = 0 ; i < t.line.length ; i++) {
                    t.line[i].stroke({color : "cyan"}) ;
                }
            }
        }) ;
        tempOverlay.on("mouseout" , function() {
            if(!_selection) {
                for(var i = 0 ; i < t.line.length ; i++) {
                    t.line[i].stroke({color : "grey"}) ;
                }
            }
        }) ;
        tempOverlay.on("click" , function(e) {
            if(!_menu && !_selection) {
                //create window with options
                var m = new Menu(e.clientX , e.clientY,150,"Wire") ;
                m.Add("Delete",t,0) ; // send the object and the action rank to perform
                _menu = m ;
                m.Add("Close",m,0) ;
            }
            // if(!_selection) {

                // delete this wire
                // for(var i = 0 ; i < t.line.length ; i++) {
                //     t.line[i].remove() ;  //remove the calling element
                // }
                // for(var i = 0 ; i < t.overlay.length ; i++) {
                //     t.overlay[i].remove() ;  //remove the calling element
                // };
                // t.Delete() ;
                // Removing references
                // _selection = t ;
                // RemoveWireReference(t) ;
            // }
        }) ;
        this.line.push(tempLine) ;
        this.overlay.push(tempOverlay) ;

        return tempOverlay ;
    }
    Delete(obj) {
        var t = obj || this ;
        for(var i = 0 ; i < t.line.length ; i++) {
            t.line[i].remove() ;  //remove the calling element
        }
        for(var i = 0 ; i < t.overlay.length ; i++) {
            t.overlay[i].remove() ;  //remove the calling element
        };
        RemoveWireReference(t) ;
    }
}
function RemoveWireReference(t) {
    // Just removing references of Wires(connections) from the Switches
    for(var i = 0 ; i < _switch.length ; i++) {
        var rank = _switch[i].connections.indexOf(t) ;
        if(rank >= 0)
            _switch[i].connections.splice(rank,1) ;
    }
    for(var i = 0 ; i < _led.length ; i++) {
        var rank = _led[i].connections.indexOf(t) ;
        if(rank >= 0)
            _led[i].connections.splice(rank,1) ;
        
        if(_led[i].connections.length == 0) {
            _led[i].on = false ;
            _led[i].circle.fill("grey") ;//Darkest green
        }
        else {
            for(var j = 0 ; j < _led[i].connections.length ; j++) {
                if(_led[i].connections[j].flow) {
                    _led[i].on = true ;
                    _led[i].circle.fill("#00b300") ; //Dark green 006600
                    break ;
                }
                else {
                    if(rank >= 0) {
                        _led[i].on = false ;
                        _led[i].circle.fill("#006600") ; //Darkest green
                    }
                }
            }
        }
    }
    for(var i = 0 ; i < _chip.length ; i++) {
        for(var j = 0 ; j < _chip[i].circuits.length ; j++) {
            var inputs = _chip[i].circuits[j].inputs ;
            for(var k = 0 ; k < inputs.length ; k++) {
                var rank = inputs[k].connections.indexOf(t) ;
                if(rank >= 0)
                    inputs[k].connections.splice(rank , 1) ;
                inputs[k].on = false ;
            }
            var outputs = _chip[i].circuits[j].outputs ;
            for(var k = 0 ; k < outputs.length ; k++) {
                var rank = inputs[k].connections.indexOf(t) ;
                if(rank >= 0)                
                    outputs[k].connections.splice(rank , 1) ;
            }
        }
        for(var j = 0 ; j < _chip[i].others.length ; j++) {
            var rank = _chip[i].others[j].connections.indexOf(t) ;
            if(rank >= 0)                
                _chip[i].others[j].connections.splice(rank , 1) ;
        }
    }
    // _selection = null ;
}
class Switch {
    constructor(x,y) {
        this.circle = toolkit.circle(20).move(x,y-10).attr({fill:"yellow"}) ;
        this.rect = toolkit.rect(20,20).move(x,y).attr({fill:"grey"}) ;
        this.led = toolkit.circle(10).move(x+5,y+5).attr({fill:"black"}) ;
        this.overlay = toolkit.rect(20,20).move(x,y).attr({fill:"transparent"}) ;

        this.connections = [] ;
        this.on = false ;
        var t = this ;

        // Turns on or off
        this.overlay.on('click' , function() {
            if(t.on) {
                t.on = false ;
                for(var i = 0 ; i < t.connections.length ; i++) {
                    t.connections[i].flow = false ;
                    // document.dispatchEvent(_event[0]) ; // Event "onflow"
                    //run ic
                }
                t.led.fill("black") ;
            }
            else {
                t.on = true ;
                for(var i = 0 ; i < t.connections.length ; i++) {
                    t.connections[i].flow = true ;
                    // document.dispatchEvent(_event[0]) ;
                }
                t.led.fill("#ff9933") ; // orange
            }

            document.dispatchEvent(_event[1]) ; // Event "updatecircuit"
            document.dispatchEvent(_event[0]) ; // Event "updateled"
        });

        this.circle.on('mouseover' ,  function() {
            this.fill("#ff9933") ; //orange
        });
        this.circle.on('mouseout' ,  function() {
            this.fill("yellow") ;
        });

        this.circle.on('click' , function() {
            //Creates a new Wire and set it as selected else complete the connection
            if(!_selection) {
                var x = this.attr("cx") , y = this.attr("cy") ;
                var tempWire = new Wire(x , y , x , y) ;
                
                //for some reason i have to do it opposite way
                // tempWire.After(t.overlay) ;
                // tempWire.After(t.led) ;
                // tempWire.After(t.rect) ;
                // tempWire.After(t.circle) ;
                // tempWire.Before(t.overlay) ;
                t.connections.push(tempWire) ;
                _selection = tempWire ;
            }
            else {
                // _selection.After(t.overlay) ;
                // _selection.After(t.led) ;
                // _selection.After(t.rect) ;
                // _selection.After(t.circle) ;
                t.connections.push(_selection) ;
                _selection = null ;
            }
        }) ;
    }
    PlaceOver(obj) {
        obj.after(this.overlay) ;
        obj.after(this.led) ;
        obj.after(this.rect) ;
        obj.after(this.circle) ;
    }
}
class Pulsor {
    constructor() {}
}
// ports are thep connection points for circuit in ic
class Port {
    constructor(x,y,type,name,infoDirection) {
        this.circle = toolkit.circle(10).move(x,y).attr({fill:"yellow"}) ;

        this.type = type ;
        this.name = name ;
        this.infoDirection = infoDirection ;

        switch(infoDirection) {
            case "left" :
                this.text = toolkit.text(name).size("8").fill("white").move(x - name.length*3.75 - 13 , y ) ;
                break ;
            case "right" :
                this.text = toolkit.text(name).size("8").fill("white").move(x+20,y) ;
                break ;
            default :
                break ;
        }

        this.on = false ;
        this.connections = [] ;

        var t = this ;

        this.circle.on('mouseover' ,  function() {
            this.fill("#ff9933") ; //orange
        });
        this.circle.on('mouseout' ,  function() {
            this.fill("yellow") ;
        });

        this.circle.on('click' , function() {
            //Creates a new Wire and set it as selected else complete the connection
            if(!_selection) {
                var x = this.attr("cx") , y = this.attr("cy") ;
                var tempWire = new Wire(x , y , x , y) ;
                t.connections.push(tempWire) ;
                _selection = tempWire ;
            }
            else {
                t.connections.push(_selection) ;
                _selection = null ;
            }
        }) ;
    }
    PlaceOver(obj) {
        obj.after(this.circle) ;
    }
    Move(x,y) {

        // var dx = Math.abs(this.circle.attr("cx") - this.text.attr("x")) ;

        // var dy = this.circle.attr("cy") - this.text.attr("y") ;

        this.circle.move(x,y) ;
        // console.log(this.text) ;
        // this.text.move(x+dx,y) ;
        switch(this.infoDirection) {
            case "left" :
                this.text.move(x - this.name.length*3.75 - 13 , y ) ;
                break ;
            case "right" :
                this.text.move(x+20,y) ;
                break ;
            default :
                break ;
        }
    }
}
class Circuit {
    constructor() {
        this.inputs = [] ;
        this.outputs = [] ;
    }
}
function SelectTable(table , input , inputIndex) {
    var selection = [] ;
  
    for(var i = 0 ; i < table.length ; i++) { 
        if(table[i].input[inputIndex] == input[inputIndex] )
            selection.push(table[i]) ;
    }
        
    if(inputIndex == input.length)
        return table ;
    else
        return SelectTable(selection , input , inputIndex+1 ) ;
}
var _selectionDrag = null ;

document.addEventListener("mousemove" , function(e) {
    if(_selectionDrag) {
        var x = Math.round(e.clientX/10)*10 , y = Math.round(e.clientY/10)*10 ;
        _selectionDrag.Move(x-_selectionDrag._w , y-_selectionDrag._h) ;
    }
}) ;
document.addEventListener("mouseup" , function(e) {
    if(_selectionDrag) {
        // var x = Math.round(e.clientX/10)*10 , y = Math.round(e.clientY/10)*10;
        // _selectionDrag.rect.move(x-_selectionDrag._w , y-_selectionDrag._h) ;
        // delete(_selectionDrag._w) ;
        // delete(_selectionDrag._h) ;
        _selectionDrag.Deletewh() ;
        _selectionDrag = null ;
    }
});
class Chip {
    constructor(x,y,w,h,type) {
        this.rect = toolkit.rect(w,h).move(x,y).attr({fill:"#00ccff"}) ; // sky blue
        this.info = {rect : null , text : null} ;

        this.gate = "" ;
        this.data = "" ;
        this.others = [] ;
        this.circuits = [] ;

    
        var t = this ;

        this.rect.on("mousedown" , function(e) {
            var x = Math.round(e.clientX/10)*10 , y = Math.round(e.clientY/10)*10;
            t._w = x - t.rect.attr("x") ;
            t._h = y - t.rect.attr("y") ;

            for(var i = 0 ; i < t.others.length ; i++) {
                t.others[i]._w = x - t.others[i].circle.attr("cx") ;
                t.others[i]._h = y - t.others[i].circle.attr("cy") ;
            }
            for(var i = 0 ; i < t.circuits.length ; i++) {
                for(var j = 0 ; j < t.circuits[i].inputs.length ; j++) {
                    t.circuits[i].inputs[j]._w = x - t.circuits[i].inputs[j].circle.attr("cx") ;
                    t.circuits[i].inputs[j]._h = y - t.circuits[i].inputs[j].circle.attr("cy") ;
                }
                for(var j = 0 ; j < t.circuits[i].outputs.length ; j++) {
                    t.circuits[i].outputs[j]._w = x - t.circuits[i].outputs[j].circle.attr("cx") ;
                    t.circuits[i].outputs[j]._h = y - t.circuits[i].outputs[j].circle.attr("cy") ;
                }
            }
            _selectionDrag = t ;
        });

        document.addEventListener("updatecircuit", function() {
            for(var i = 0 ; i < t.circuits.length ; i++) {
                var input = [] ;

                // Updates the ports input from wires
                for(var j = 0 ; j < t.circuits[i].inputs.length ; j++) {
                    var port = t.circuits[i].inputs[j] ;
                    for(var k = 0 ; k < port.connections.length ; k++) {
                        if(port.connections[k].flow) {
                            port.on = true ;
                            port.circle.fill("#ff00ff") ; // purple color
                            break ;
                        }
                        else {
                            port.on = false ;
                            port.circle.fill("yellow") ;
                        }
                    }

                    input.push(t.circuits[i].inputs[j].on) ;
                }

                // Small algorithm to find the right table from data as per input
                var table = SelectTable(t.data.table , input , 0) ;

                // Applies to it's respective ouputs and it's connected wires
                // console.log(t.circuits[i].outputs) ;
                for(var j = 0 ; j < t.circuits[i].outputs.length ; j++) {
                    var port = t.circuits[i].outputs[j] ;
                    // console.log
                    port.on = table[0].output[j] == 1 ? true : false ;

                    for(var k = 0 ; k < port.connections.length ; k++) { // Sets to all connected wires
                        port.connections[k].flow = port.on ;

//Testing
                        // if(table[0].output[0])
                        //     port.circle.fill("red") ;
                        // else 
                        //     port.circle.fill("yellow") ;
                    }
                }
            }
        }) ;
    }
    
    Move(x,y) {
        this.rect.move(x,y) ;

        var pL = this.data.iportLeft ;

        if(this.info.rect) 
            this.info.rect.move( x , y + pL.length*20) ;
        if(this.info.text) 
            this.info.text.move(x + (this.rect.attr("width")/2) - (this.data.name.length*6/2) , y+2+ pL.length*20) ;

        for(var i = 0 ; i < this.others.length ; i++) {
            this.others[i].Move(x-this.others[i]._w+this._w-5,y-this.others[i]._h+this._h-5) ;
            for(var j = 0 ; j < this.others[i].connections.length ; j++) {
                this.others[i].connections[j].Delete() ;
            }
        }
        for(var i = 0 ; i < this.circuits.length ; i++) {
            for(var j = 0 ; j < this.circuits[i].inputs.length ; j++) {
                this.circuits[i].inputs[j].Move(x-this.circuits[i].inputs[j]._w+this._w-5,y-this.circuits[i].inputs[j]._h+this._h-5) ;
                for(var k = 0 ; k < this.circuits[i].inputs[j].connections.length ; k++) {
                    this.circuits[i].inputs[j].connections[k].Delete() ;
                }
            }
            for(var j = 0 ; j < this.circuits[i].outputs.length ; j++) {
                this.circuits[i].outputs[j].Move(x-this.circuits[i].outputs[j]._w+this._w-5,y-this.circuits[i].outputs[j]._h+this._h-5) ;
                for(var k = 0 ; k < this.circuits[i].outputs[j].connections.length ; k++) {
                    this.circuits[i].outputs[j].connections[k].Delete() ;
                }
            }
        }

    }
    Deletewh() {
        delete(this._w) ;
        delete(this._h) ;

        for(var i = 0 ; i < this.others.length ; i++) {
            delete(this.others[i]._w) ;
            delete(this.others[i]._h) ;
        }

        for(var i = 0 ; i < this.circuits.length ; i++) {
            for(var j = 0 ; j < this.circuits[i].inputs.length ; j++) {
                delete(this.circuits[i].inputs[j]._w) ;
                delete(this.circuits[i].inputs[j]._h) ;
            }
            for(var j = 0 ; j < this.circuits[i].outputs.length ; j++) {
                delete(this.circuits[i].outputs[j]._w) ;
                delete(this.circuits[i].outputs[j]._h) ;
            }
        }
    }
    Awake(icType) {
        var ports = [] ;
        var circuitLength = 0 ;

        var pLLength = this.data.iportLeft.length ;
        var pL = this.data.iportLeft ;

        var pRLength = this.data.iportRight.length ;
        var pR = this.data.iportRight ;

        this.rect.attr({"height" : pL.length*20}) ;
        
        // Creating info about CHIP
        this.info.rect = toolkit.rect(this.rect.attr("width"),15).move(this.rect.attr("x") , this.rect.attr("y")+ pL.length*20).fill("grey") ;
        this.info.text = toolkit.text(this.data.name).size("10").fill("white").move(this.rect.attr("x")+(this.rect.attr("width")/2) - (this.data.name.length*6/2) , this.rect.attr("y")+2+ pL.length*20) ;


        // Get the max amount of chips to be created
        for(var i = 0 ; i < pLLength ; i++) {
            if(circuitLength < pL[i].relative)
                circuitLength = pL[i].relative ;
        }
        
        for(var i = 0 ; i < pRLength ; i++) {
            if(circuitLength < pR[i].relative)
                circuitLength = pR[i].relative ;
        }

        // Creating a ports
        var y = 0 , radius = 7  , xUnit = -15 , yUnit = 5;
        for(var i = 0 ; i < pL.length ; i++) {
            var tempPort = new Port(this.rect.attr("x") + xUnit , this.rect.attr("y") + yUnit + y , pL[i].type , this.data.iportLeft[i].name , "right") ;
            ports.push(tempPort) ;
            y += 20 ;
        }
        xUnit = this.rect.attr("width") + 5 ;
        y = 0 ;
        for(var i = 0 ; i < this.data.iportRight.length ; i++) {
            var tempPort = new Port(this.rect.attr("x") + xUnit , this.rect.attr("y") + yUnit + y , this.data.iportRight[i].type , this.data.iportRight[i].name , "left") ;
            ports.push(tempPort) ;
            y += 20 ;
        }


        for(var i = 0 ; i <= circuitLength ; i++) {
            var tempCircuit = new Circuit() ;
            this.circuits.push(tempCircuit) ;
            for(var j = 0 ; j < pLLength ; j++) { // sorting inputs and outputs in circuit
                if(i == pL[j].relative) {
                    if(pL[j].type == "input")
                        tempCircuit.inputs[pL[j].rank] = ports[j] ;
                    else if(pL[j].type == "output") {
                        tempCircuit.outputs[pL[j].rank] = ports[j] ;
                    }
                }
                // else {
                    // this.others.push(ports[j]) ;
                // }
            }
            for(var j = 0 ; j < pRLength ; j++) { // sorting inputs and outputs in circuit
                if(i == pR[j].relative) {
                    if(pR[j].type == "input")
                        tempCircuit.inputs[pR[j].rank] = ports[j+pLLength] ;
                    else if(pR[j].type == "output") {
                        tempCircuit.outputs[pR[j].rank] = ports[j+pLLength] ;
                    }
                }
                // else {
                    // this.others.push(ports[j+pLLength]) ;
                    
                // }
            }
            // console.log(this.others) ;
        }

        // Adding other types of ports to others
        for(var i = 0 ; i < pLLength ; i++) {
            if(pL[i].relative==-1) {
                this.others.push(ports[i]) ;
            }
        }
        for(var i = 0 ; i < pRLength ; i++) {
            if(pR[i].relative==-1) {
                this.others.push(ports[i+pLLength]) ;
            }
        }
        // console.log(this.others) ;
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
// var _pulsor = [] ;
// var _circuit = [] ;
var _chip = [] ;
var _grid ;
// var _button = [] ;
var _wire = [] ;
var _selection = null ;
var _event = [] ;

_event.push (new CustomEvent("updateled" , {detail: 4 , bubbles: true , cancelable: true})) ;
_event.push (new CustomEvent("updatecircuit" , {detail: 4 , bubbles: true , cancelable: true})) ;

window.onload = function() {
    // Maxing height and width of our control bar
    var control = document.getElementById("control").style ;
    control.height = window.innerHeight +"px" ;

    var x , y ;
    
    // grid
    _grid = new Grid(0, 0 , window.innerWidth , window.innerHeight  , 10) ;
    
    // leds
    x = 60 ;
    for(var i = 0 ; i < 10 ; i++) {
        var ledTemp = new Led(x,30,20) ;
        _led.push(ledTemp) ;
        x += 40 ;
    }
    
    // //circuits
    // x = 60 ;
    // for(var i = 0 ; i < 4 ; i++) {
    //     var circuit = new Chip(x,100,100,250);
    //     _chip.push(circuit) ;
    //     x += 100+100 ;    
    // }
    
    //buttons
    x=60 ;
    for(var i = 0 ; i < 10 ; i++) {
        var switchTemp = new Switch(x,400);
        _switch.push(switchTemp) ;
        x += 40 ;
    }
}

//Testing
// document.onclick = function(e) {
//     //create window with options
//     // var m = new Menu(e.clientX , e.clientY,150,"Exclusive OR gate") ;
//     // m.Add("Hello") ;
//     // m.Add("text") ;
//     // m.Add("Move") ;

// }

function CreateCircuit(type) {
    var e = window.event ;
    var tempChip = new Chip(Math.round(e.clientX/10)*10 , Math.round(e.clientY/10)*10 , 80 , 250 , type) ;
    tempChip.data = data_JSON.gate[type] ;
    tempChip.Awake() ;
    
    _chip.push(tempChip) ;
}

window.onclick = UpdateClick ;
function UpdateClick() {
    if(_selection) {
        var e = window.event  , x = Math.round(e.clientX/10)*10 , y = Math.round(e.clientY/10)*10;

        var x1 = x - _selection.line[_selection.line.length-1].attr("x1")  ;
        var y1 = y - _selection.line[_selection.line.length-1].attr("y1")  ;

        var angle = MouseToAngle(x1,y1) ;

        var obj ;
        // console.log(angle) ;
        if(angle < 45 && angle > -45) {
            obj = _selection.Break(x , _selection.line[_selection.line.length-1].attr("y1")) ;
            // console.log("right");
        }
        else if(angle > 45 && angle < 135) {
            obj = _selection.Break(_selection.line[_selection.line.length-1].attr("x1"), y) ;
            // console.log("top");
        }
        else if(angle >= 135 && angle <= 180 || angle <= -135 && angle >= -180) {
            obj = _selection.Break(x , _selection.line[_selection.line.length-1].attr("y1")) ;
            // console.log("left");
        }
        else if(angle < -45 && angle > -135) {
            obj = _selection.Break(_selection.line[_selection.line.length-1].attr("x1") , y) ;
            // console.log("down");
        }

        // The new wire is placed correctly before all the elements
        for(var i = 0 ; i < _switch.length ; i++) {
            _switch[i].PlaceOver(obj) ;
        }
        for(var i = 0 ; i < _led.length ; i++) {
            _led[i].PlaceOver(obj) ;
        }
        for(var i = 0 ; i < _chip.length ; i++) {
            for(var j = 0 ; j < _chip[i].circuits.length ; j++) {
                var inputs =  _chip[i].circuits[j].inputs ;
                var outputs = _chip[i].circuits[j].outputs ;

                for(var k = 0 ; k < inputs.length ; k++) {
                    inputs[k].PlaceOver(obj) ;
                }
                for(var k = 0 ; k < outputs.length ; k++) {
                    outputs[k].PlaceOver(obj) ;
                }
            }
            for(var j = 0 ; j < _chip[i].others.length ; j++) {
                _chip[i].others[j].PlaceOver(obj) ;
            }
        }
    }
}
window.onmousemove = UpdateMove ;
function UpdateMove() {
    if(_selection) {
        var e = window.event  , x = Math.round(e.clientX/10)*10 , y = Math.round(e.clientY/10)*10;

        var x1 = x - _selection.line[_selection.line.length-1].attr("x1")  ;
        var y1 = y - _selection.line[_selection.line.length-1].attr("y1")  ;

        var angle = MouseToAngle(x1,y1) ;
        if(angle < 45 && angle > -45) {
            _selection.Update(x , _selection.line[_selection.line.length-1].attr("y1")) ;
        }
        else if(angle > 45 && angle < 135) {
            _selection.Update(_selection.line[_selection.line.length-1].attr("x1"), y) ;
        }
        else if(angle >= 135 && angle <= 180 || angle <= -135 && angle >= -180) {
            // console.log("left") ;
            _selection.Update(x , _selection.line[_selection.line.length-1].attr("y1")) ;
        }
        else if(angle < -45 && angle > -135) {
            _selection.Update(_selection.line[_selection.line.length-1].attr("x1") , y) ;
        }
    }
}

function MouseToAngle(x,y) {
    var angle = Math.atan2(-y,x) ;
    angle = angle * 180/Math.PI ;
    return angle ;
}