class FunnyBoard extends Board{

    updateLineDisplay(){
        super.updateLineDisplay();
        this.text.segments.forEach(
            (s) => {
                s.pathData = s.pathData.map(e => e + this.lines * (Math.random() - 0.5))
            }
        )
    }

    updateDisplay(){
        super.updateDisplay();
        if(this.player.winText != null){
            this.player.winText.segments.forEach(
                (s) => {
                    s.pathData = s.pathData.map(e => e + this.lines * (Math.random() - 0.5))
                }
            )
        }

        this.leftLine.geom.x1 = this.renderX(-0.5);
        this.leftLine.geom.y1 = this.renderY(-0.5);
        this.leftLine.geom.x2 = this.renderX(-0.5);
        this.leftLine.geom.y2 = this.renderY(boardHeight - 0.5);
         
        this.rightLine.geom.x1 = this.renderX(boardWidth-0.5);
        this.rightLine.geom.y1 = this.renderY(-0.5);
        this.rightLine.geom.x2 = this.renderX(boardWidth-0.5);
        this.rightLine.geom.y2 = this.renderY(boardHeight - 0.5);

        this.bottomLine.geom.x1 = this.renderX(-0.5); 
        this.bottomLine.geom.y1 = this.renderY(-0.5);
        this.bottomLine.geom.x2 = this.renderX(boardWidth-0.5);
        this.bottomLine.geom.y2 = this.renderY(-0.5);        

        this.rows.forEach(e => e.updateX());

        this.dots.forEach(
            (e, i) => {
                let x = (i % (boardWidth-1)) + 1;
                let y = Math.floor(i / (boardWidth - 1)) + 1;

                e.x = this.renderX(x - 0.5); 
                e.y = this.renderY(y - 0.5);
            }
        );
    }

    renderX(x){
        return super.renderX(x) + this.lines * (Math.random() - 0.5);
    }

    renderY(y){
        return super.renderY(y) + this.lines * (Math.random() - 0.5);
    }
}