class Tower {
    constructor(x, y, w, h){
        this.w = w
        this.h = h
        this.image = loadImage("../assets/tower.png")
        this.body = Bodies.rectangle(x, y, this.w, this.h, {isStatic:true})
        World.add(world, this.body)
    }

    display() {
        var pos = this.body.position;
        var angle = this.body.angle;
        
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        imageMode(CENTER);
        image(this.image, 0, 0, this.w, this.h);
        pop();
      }
    }