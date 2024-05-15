const pieceNames = ["T","O", "Z", "S", "J", "L", "I"];
const bagRefillCount = 6;
const bagLocationX = 12;
const bagLocationY = 21;
const bagOffset = 4;
const bagDisplaySize = 3;

class Bag{

    bag = [];

    constructor(board){
        this.board = board;
        this.img = new Array(4 * bagDisplaySize).fill().map(e => scene.add.rectangle(20, 20, boardTileWidth, boardTileWidth, 0xff0000));
        this.refill();
    }

    refill(){
        this.bag.push(...pieceNames.slice().sort((a, b) => Math.random() - 0.5));
    }

    pull(){
        if(this.bag.length < bagRefillCount) this.refill();

        for(var p = 0; p < bagDisplaySize; p++){
            var type = this.bag[p + 1];

            var mat = pieceMatrices[type][0];
            var offset = Math.floor(mat.length / 2);

            var i = 0;
            for(var y = 0; y < mat.length; y++){
                for(var x = 0; x < mat.length; x++){
                    if(mat[y][x] == "#"){
                        this.img[i + 4 * p].setY(
                            this.board.renderY(-bagOffset * p + y + bagLocationY - offset)
                        ).setX(
                            this.board.renderX(bagLocationX + x - offset)
                        );

                        this.img[i + 4 * p].fillColor = palette[type]
                        i++;
                    }
                }
            }
        }

        return this.bag.splice(0, 1)[0];
    }

}