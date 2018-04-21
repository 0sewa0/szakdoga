class Player {
    constructor(id, user, name, spawn, positionX, positionY) {
        this.id = id;
        this.user = user;
        this.name = name
        this.score = 0;
        this.bestScore = 0;

        this.spawn = spawn
        this.positionX = positionX;
        this.positionY = positionY;

        this.velocityX = 0;
        this.velocityY = 0;

        this.shield = false;
    }
}

module.exports = Player;