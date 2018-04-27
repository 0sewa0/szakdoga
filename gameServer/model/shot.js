class Shot {
    constructor(user, id, positionX, positionY, velocityX, velocityY, ttl) {
        this.user = user;
        this.id = id;
        this.positionX = positionX;
        this.positionY = positionY;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.ttl = ttl;
    }
}

module.exports = Shot;