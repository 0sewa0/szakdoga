function Obstacle()
{
    
    this.down_left_x1 = -CANVAS_MAP_X + CANVAS_OBSTACLES_WIDTH;
    this.down_left_y1 = CANVAS_MAP_Y - CANVAS_OBSTACLES_HEIGHT;
    this.down_left_x2 = -CANVAS_MAP_X + CANVAS_OBSTACLES_WIDTH;
    this.down_left_y2 = CANVAS_MAP_Y - CANVAS_OBSTACLES_HEIGHT * 2;
    this.down_left_x3 = -CANVAS_MAP_X + CANVAS_OBSTACLES_WIDTH * 2;
    this.down_left_y3 = CANVAS_MAP_Y - CANVAS_OBSTACLES_HEIGHT * 2;
    this.down_left_x4 = -CANVAS_MAP_X + CANVAS_OBSTACLES_WIDTH * 2;
    this.down_left_y4 = CANVAS_MAP_Y - CANVAS_OBSTACLES_HEIGHT;
    
    this.show_down_left = function()
    {
        quad(this.down_left_x1,this.down_left_y1,this.down_left_x2,this.down_left_y2,this.down_left_x3,this.down_left_y3,this.down_left_x4,this.down_left_y4);
    }

    this.down_right_x1 = CANVAS_MAP_X - 100;
    this.down_right_y1 = CANVAS_MAP_Y - 100;
    this.down_right_x2 = CANVAS_MAP_X - 100;
    this.down_right_y2 = CANVAS_MAP_Y - 100 - 100;
    this.down_right_x3 = CANVAS_MAP_X - 100 - 100;
    this.down_right_y3 = CANVAS_MAP_Y - 100 - 100;
    this.down_right_x4 = CANVAS_MAP_X - 100 - 100;
    this.down_right_y4 = CANVAS_MAP_Y - 100;

    this.show_down_right = function()
    {
        quad(this.down_right_x1, this.down_right_y1, this.down_right_x2, this.down_right_y2, this.down_right_x3, this.down_right_y3, this.down_right_x4, this.down_right_y4);
    }

    this.up_left_x1 = -CANVAS_MAP_X + 100;
    this.up_left_y1 = -CANVAS_MAP_Y + 100;
    this.up_left_x2 = -CANVAS_MAP_X + 100 + 100;
    this.up_left_y2 = -CANVAS_MAP_Y + 100;
    this.up_left_x3 = -CANVAS_MAP_X + 100 + 100;
    this.up_left_y3 = -CANVAS_MAP_Y + 100 + 100;
    this.up_left_x4 = -CANVAS_MAP_X + 100;
    this.up_left_y4 = -CANVAS_MAP_Y + 100 + 100;
    
    this.show_up_left = function()
    {
        quad(this.up_left_x1, this.up_left_y1, this.up_left_x2, this.up_left_y2, this.up_left_x3, this.up_left_y3, this.up_left_x4, this.up_left_y4);
    }

    this.up_right_x1 = CANVAS_MAP_X - 100;
    this.up_right_y1 = -CANVAS_MAP_Y + 100;
    this.up_right_x2 = CANVAS_MAP_X - 100 - 100;
    this.up_right_y2 = -CANVAS_MAP_Y + 100;
    this.up_right_x3 = CANVAS_MAP_X - 100 - 100;
    this.up_right_y3 = -CANVAS_MAP_Y + 100 + 100;
    this.up_right_x4 = CANVAS_MAP_X - 100;
    this.up_right_y4 = -CANVAS_MAP_Y + 100 + 100;

    this.show_up_right = function()
    {
        quad(this.up_right_x1, this.up_right_y1, this.up_right_x2, this.up_right_y2, this.up_right_x3, this.up_right_y3, this.up_right_x4, this.up_right_y4);
    }

    this.show = function()
    {
        push();
        noStroke();
        fill(0);
        this.show_down_left();
        this.show_down_right();
        this.show_up_left();
        this.show_up_right();
        pop();
    }
    
}