const keyboardControllScheme = [
    {
        rotate: "E", left: "S", down: "D", right: "F", drop: "Z", hold: "A", altRotate: "Q"
    },
    {
        rotate: "UP", left: "LEFT", down: "DOWN", right: "RIGHT", drop: "SPACE", hold: "C", altRotate: "Z"
    },
    {
        rotate: "UP", left: "LEFT", down: "DOWN", right: "RIGHT", drop: 190, hold: 188, altRotate: "M"
    }
];

var keyboard = new Array(keyboardControllScheme.length).fill().map(e => new Object);
var keyRefCounter = new Array(Object.keys(keyboardControllScheme[0]).length).fill().map(e => new Object);

function initInput(){
    for(let i = 0; i < keyboardControllScheme.length; i++){
        for(const key of Object.keys(keyboardControllScheme[i])){
            keyRefCounter[i][key] = 0;
            keyboard[i][key] = scene.input.keyboard.addKey(
                keyboardControllScheme[i][key]
            );
        }
    }
}

function isDown(port, input){
    let down = false;
    down = keyboard[port][input].isDown;
    
    if(!down) keyRefCounter[port][input] = 0;
    else keyRefCounter[port][input]++;

    return down;
}

function isHit(port, input){
    isDown(port, input);
    return keyRefCounter[port][input] == 1;
}

function isPressed(port, input, repeat = 12, delay = 2){
    return isHit(port, input) || (keyRefCounter[port][input] > repeat && keyRefCounter[port][input] % delay == 0)
}