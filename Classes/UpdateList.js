class UpdateList{

    static list = {};
    static pauseTime = 0;

    static add(element, key = "default"){
        if(!this.list[key]){
            this.list[key] = [];
        }
        this.list[key].push(element);
    }

    static remove(element, key = "default", callRemove = false){
        let list = UpdateList.list[key];

        let i = list.indexOf(element);
        if(i < 0) return;

        let r = UpdateList.list[key].splice(i, 1)[0];
        if(callRemove) r.remove();
    }

    static clear(key = "default", callRemove = false){
        let list = UpdateList.list[key];

        if(callRemove && list) list.forEach(e => e.remove());
        UpdateList.list[key] = [];
    }

    static pause(delay){
        this.pauseTime = delay;
    }

    static update(){
        if(this.pauseTime > 0){
            this.pauseTime--;
            return;
        }

        for(const v of Object.values(this.list)) {
            v.forEach(e => e.update());
        }
    }

    static get(key = "default"){
        if(this.list[key]){
            return this.list[key];
        }
        return [];
    }

}