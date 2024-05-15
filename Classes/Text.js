const textHorizSpacing = 1.6
const textVertiSpacing = 3;
const tabSpacing = 10;

class Text{

    //I fucking hate this
    static shapes = {
        "0": [0, 0, 1, 0, 1, 2, 0, 2, 0, 0],
        "1": [0, 0, 0.5, 0, 0.5, 2, 0, 2, 1, 2],
        "2": [0, 0, 1, 0, 1, 1, 0, 1, 0, 2, 1, 2],
        "3": [0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 2, 0, 2],
        "4": [1, 2, 1, 0, 1, 1, 0, 1, 0, 0],
        "5": [1, 0, 0, 0, 0, 1, 1, 1, 1, 2, 0, 2],
        "6": [0, 1, 1, 1, 1, 2, 0, 2, 0, 0, 1, 0],
        "7": [0, 0, 1, 0, 0.5, 2],
        "8": [0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 2, 0, 2, 0, 0],
        "9": [1, 1, 0, 1, 0, 0, 1, 0, 1, 2, 0, 2],
        "A": [0, 2, 0, 0, 1, 0, 1, 2, 1, 1, 0, 1],
        "B": [0, 0, 1, 0, 1, 0.5, 0.5, 1, 1, 1.5, 1, 2, 0, 2, 0, 0],
        "C": [1, 0, 0, 0, 0, 2, 1, 2],
        "D": [0, 0, 0.5, 0, 1, 0.5, 1, 1.5, 0.5, 2, 0, 2, 0, 0],
        "E": [1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 2, 1, 2],
        "F": [1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 2],
        "G": [0.5, 1, 1, 1, 1, 2, 0, 2, 0, 0, 1, 0],
        "H": [0, 0, 0, 2, 0, 1, 1, 1, 1, 0, 1, 2],
        "I": [0, 0, 1, 0, 0.5, 0, 0.5, 2, 0, 2, 1, 2],
        "J": [0, 2, 0.5, 2, 0.5, 0, 0, 0, 1, 0],
        "K": [0, 0, 0, 2, 0, 1, 1, 0, 0, 1, 1, 2],
        "L": [0, 0, 0, 2, 1, 2],
        "M": [0, 2, 0, 0, 0.5, 1, 1, 0, 1, 2],
        "N": [0, 2, 0, 0, 1, 2, 1, 0],
        "O": [0, 0, 1, 0, 1, 2, 0, 2, 0, 0],
        "P": [0, 1, 1, 1, 1, 0, 0, 0, 0, 2],
        "Q": [1, 2, 0, 2, 0, 0, 1, 0, 1, 2, 0.5, 1],
        "R": [0, 2, 0, 0, 1, 0, 1, 1, 0, 1, 0.5, 1, 1, 2],
        "S": [1, 0, 0, 0, 0, 1, 1, 1, 1, 2, 0, 2],
        "T": [0.5, 2, 0.5, 0, 0, 0, 1, 0],
        "U": [0, 0, 0, 2, 1, 2, 1, 0],
        "V": [0, 0, 0.5, 2, 1, 0],
        "W": [0, 0, 0, 2, 0.5, 1, 1, 2, 1, 0],
        "X": [0, 0, 1, 2, 0.5, 1, 1, 0, 0, 2],
        "Y": [0, 0, 0.5, 1, 1, 0, 0.5, 1, 0.5, 2],
        "Z": [0, 0, 1, 0, 0, 2, 1, 2],
        "-": [0, 1, 1, 1],
        "a": [0.25, 1.5, 0.75, 1.5],
        "b": [0.25 - textHorizSpacing, 0.5, 0.75 - textHorizSpacing, 0.5]
    }

    static upper = "4HKLMNUVWXY";
    static lower = "47AFHKMNPRTVWXY";
 
    segments = [];

    constructor(x, y, t = "", scale = 5){
        this.x = x;
        this.y = y;
        this.scale = scale;

        this.text = t.toUpperCase().replaceAll(":", "ab");

        this.updateText();
    }

    updateText(){//This is shit
        let t = this.text.toUpperCase().split("").filter(e => !!Text.shapes[e]).length;

        while(this.segments.length < t) this.segments.push(scene.add.polygon(-50, -50, [0, 0], 0, 0).setStrokeStyle(strokeWidth, 0xffffff).setOrigin(0, 0));
        while(t < this.segments.length) this.segments.splice(this.segments.length - 1, 1)[0].destroy();

        let i = 0, x = this.x, y = this.y;

        for(const l of this.text){
            if(!Text.shapes[l]){
                if(l == " "){
                    x += textHorizSpacing * this.scale
                }else if(l == "\n"){
                    x = this.x;
                    y += textVertiSpacing * this.scale;
                }else if(l == "\t"){
                    x = Math.ceil((x - this.x) / (textHorizSpacing * this.scale * tabSpacing)) * (textHorizSpacing * this.scale * tabSpacing) + this.x
                }
                continue;
            }

            let shape = Text.shapes[l].slice();
            let s = this.segments[i];

            for(let j = 0; j < shape.length; j++){
                let yMod = 0;
                if(j % 2 == 1){
                    if(shape[j] == 0 && Text.upper.indexOf(l) >= 0) yMod = -strokeWidth;
                    if(shape[j] == 2 && Text.lower.indexOf(l) >= 0) yMod = strokeWidth;
                }
                shape[j] *= this.scale;
                shape[j] += yMod * 0.5;
            }

            s.pathData = shape;
            s.x = x;
            s.y = y;

            i++;
            x += textHorizSpacing * this.scale;
        }
    }

    setText(t){
        t = t + "";
        if(t.toUpperCase() == this.text) return;
        this.text = t.toUpperCase().replaceAll(":", "ab");
        this.updateText();
    }

    setColour(c){
        let hex = colours[c];
        this.segments.forEach(e => e.strokeColor = hex);
    }

    setAlpha(a){
        this.segments.forEach(e => e.setAlpha(a));
    }

    remove(){
        this.segments.forEach(e => e.destroy());
    }
    
}