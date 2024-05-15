const files = [
    {
        Libraries: ["phaser.min"],
        Game: ["Scene", "Input", "Game", "PieceConstants"],
        Classes: ["updateList",  "Text", "Board", "Bag", "PossesedPiece", "GhostPiece", "FunnyBoard"]
    },
    "Start"
];

let fileQueue = [];
function f(p, path = ""){p.forEach(e => {if(typeof e == "object"){Object.keys(e).forEach(a => f(e[a], path + a + "/"));}else{fileQueue.push(path + e);}});}

f(files);

fileQueue.forEach(name => {
    let e = document.createElement('script');

    e.src = name + ".js";
    e.async = false; 

    document.body.appendChild(e);
});