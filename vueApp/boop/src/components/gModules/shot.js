import * as params from './params'

export default class Shot {
    constructor(start, user, id, color = params.SHOT_BASE_COLOR) {
        this.user = user; // The id of the user that this bullet belongs to
        this.id = id,
        this.position = start.copy();
        this.color = color;
        this.velocity = p5.createVector(p5.mouseX - p5.width / 2, p5.mouseY - p5.height / 2).setMag(params.SHOT_SPEED); // The vector that defines the direction that the shot goes in and at what speed
        this.ttl = params.SHOT_TTL; // How long the shot stays in the game (without this it would fly for quite a while)
    }

    update() {
        this.position.add(this.velocity); //Move the shot
    }

    wallCheck() {
        params.CANVAS_OBSTACLES.forEach(obstacle => {
            if (this.position.x > obstacle.x1 - params.SHOT_RADIUS &&
                this.position.x < obstacle.x4 + params.SHOT_RADIUS &&
                this.position.y < obstacle.y1 + params.SHOT_RADIUS &&
                this.position.y > obstacle.y2 - params.SHOT_RADIUS) {

                    this.ttl = 0;
                    return true;
            }
        });
        const distanceFromCenter = this.position.dist(p5.createVector(params.CANVAS_OBSTACLES_CENTER_PIECE.x, params.CANVAS_OBSTACLES_CENTER_PIECE.y));
        // If the distance is smaller than the sum of the two objects radii(plural of radius) then the two object intesect
        if (distanceFromCenter < params.SHOT_RADIUS + params.CANVAS_OBSTACLES_CENTER_PIECE.r1 / 2) {
            this.ttl = 0;
            return true;
        }
    }

    render() {
        p5.push(); // The options which determan the way we draw objects are stored globaly, and we want to 'protect' them from so we store them in a stack temporarly.
            p5.stroke(this.color); // Then we draw our special object with different options
            p5.strokeWeight(params.SHOT_STROKE_WEIGHT);
            p5.fill(this.color);
            p5.ellipse(this.position.x, this.position.y, params.SHOT_RADIUS * 2, params.SHOT_RADIUS * 2);
        p5.pop(); // Then we restore the options to what they were before
    }

    show() {
        this.wallCheck();
        this.update();
        this.render();
        this.ttl--;
    }
}