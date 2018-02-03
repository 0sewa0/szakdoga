function Shot(start, user, color = SHOT_BASE_COLOR)
{
    this.user = user; // The id of the user that this bullet belongs to

    this.position = start.copy();
    this.radius = SHOT_RADIUS;
    this.color = color;
    this.velocity = createVector(mouseX - width/2, mouseY - height/2).setMag(SHOT_SPEED); // The vector that defines the direction that the shot goes in and at what speed 
    this.ttl = SHOT_TTL; // How long the shot stays in the game

    this.update = function()
    {
        this.position.add(this.velocity);
    }

    this.render = function()
    {
        push();
        stroke(this.color);
        strokeWeight(SHOT_STROKE_WEIGHT);
        fill(this.color);
        ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
        pop();
    }

    this.show = function()
    {
        this.update();
        this.render();
        this.ttl--;
    }
}