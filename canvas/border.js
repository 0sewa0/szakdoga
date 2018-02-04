function Border() 
{
    this.top_border_corner_lower_left_x = -CANVAS_MAP_X - UNIT_RADIUS;
    this.top_border_corner_lower_left_y = -CANVAS_MAP_Y - UNIT_RADIUS;

    this.top_border_corner_lower_right_x = CANVAS_MAP_X + UNIT_RADIUS;
    this.top_border_corner_lower_right_y = -CANVAS_MAP_Y - UNIT_RADIUS;

    this.top_border_corner_upper_left_x = -CANVAS_MAP_X - UNIT_RADIUS;
    this.top_border_corner_upper_left_y = -CANVAS_MAP_Y - CANVAS_SIZE_Y / 2 - UNIT_RADIUS;

    this.top_border_corner_upper_right_x = CANVAS_MAP_X + UNIT_RADIUS;
    this.top_border_corner_upper_right_y = -CANVAS_MAP_Y - CANVAS_SIZE_Y / 2 - UNIT_RADIUS;

    this.draw_top = function()
    {
        noStroke();
        fill(CANVAS_BORDER_COLOR);
        quad(this.top_border_corner_lower_left_x, this.top_border_corner_lower_left_y, this.top_border_corner_lower_right_x, this.top_border_corner_lower_right_y, this.top_border_corner_upper_right_x, this.top_border_corner_upper_right_y, this.top_border_corner_upper_left_x, this.top_border_corner_upper_left_y);
    }

    this.left_border_corner_lower_left_x = -CANVAS_MAP_X - CANVAS_SIZE_X / 2 - UNIT_RADIUS;
    this.left_border_corner_lower_left_y = CANVAS_MAP_Y + CANVAS_SIZE_Y / 2 + UNIT_RADIUS; 

    this.left_border_corner_lower_right_x = -CANVAS_MAP_X - UNIT_RADIUS;
    this.left_border_corner_lower_right_y = CANVAS_MAP_Y + CANVAS_SIZE_Y / 2 + UNIT_RADIUS;
    
    this.left_border_corner_upper_left_x = -CANVAS_MAP_X - CANVAS_SIZE_X / 2 - UNIT_RADIUS;
    this.left_border_corner_upper_left_y = -CANVAS_MAP_Y - CANVAS_SIZE_Y / 2 - UNIT_RADIUS;
    
    this.left_border_corner_upper_right_x = -CANVAS_MAP_X - UNIT_RADIUS;
    this.left_border_corner_upper_right_y = -CANVAS_MAP_Y - CANVAS_SIZE_Y / 2 - UNIT_RADIUS;

    this.draw_left = function()
    {
        noStroke();
        fill(CANVAS_BORDER_COLOR);
        quad(this.left_border_corner_lower_left_x, this.left_border_corner_lower_left_y, this.left_border_corner_lower_right_x, this.left_border_corner_lower_right_y, this.left_border_corner_upper_right_x, this.left_border_corner_upper_right_y, this.left_border_corner_upper_left_x, this.left_border_corner_upper_left_y);
    }

    this.right_border_corner_lower_left_x = CANVAS_MAP_X + UNIT_RADIUS;
    this.right_border_corner_lower_left_y = CANVAS_MAP_Y + CANVAS_SIZE_Y / 2 + UNIT_RADIUS; 
    
    this.right_border_corner_lower_right_x = CANVAS_MAP_X + CANVAS_SIZE_X / 2 + UNIT_RADIUS;
    this.right_border_corner_lower_right_y = CANVAS_MAP_Y + CANVAS_SIZE_Y / 2 + UNIT_RADIUS;
    
    this.right_border_corner_upper_left_x = CANVAS_MAP_X + UNIT_RADIUS;
    this.right_border_corner_upper_left_y = -CANVAS_MAP_Y - CANVAS_SIZE_Y / 2 - UNIT_RADIUS;
    
    this.right_border_corner_upper_right_x = CANVAS_MAP_X + CANVAS_SIZE_X / 2 + UNIT_RADIUS;
    this.right_border_corner_upper_right_y = -CANVAS_MAP_Y - CANVAS_SIZE_Y / 2 - UNIT_RADIUS;

    this.draw_right = function()
    {
        noStroke();
        fill(CANVAS_BORDER_COLOR);
        quad(this.right_border_corner_lower_left_x, this.right_border_corner_lower_left_y, this.right_border_corner_lower_right_x, this.right_border_corner_lower_right_y, this.right_border_corner_upper_right_x, this.right_border_corner_upper_right_y, this.right_border_corner_upper_left_x, this.right_border_corner_upper_left_y);
    }

    this.bottom_border_corner_lower_left_x = -CANVAS_MAP_X - UNIT_RADIUS;
    this.bottom_border_corner_lower_left_y = CANVAS_MAP_Y + UNIT_RADIUS;  
    
    this.bottom_border_corner_lower_right_x = CANVAS_MAP_X + UNIT_RADIUS;
    this.bottom_border_corner_lower_right_y = CANVAS_MAP_Y + UNIT_RADIUS;
    
    this.bottom_border_corner_upper_left_x = -CANVAS_MAP_X - UNIT_RADIUS;
    this.bottom_border_corner_upper_left_y = CANVAS_MAP_Y + CANVAS_SIZE_Y / 2 + UNIT_RADIUS;
    
    this.bottom_border_corner_upper_right_x = CANVAS_MAP_X + UNIT_RADIUS;
    this.bottom_border_corner_upper_right_y = CANVAS_MAP_Y + CANVAS_SIZE_Y / 2 + UNIT_RADIUS;

    this.draw_bottom = function()
    {
        noStroke();
        fill(CANVAS_BORDER_COLOR);
        quad(this.bottom_border_corner_lower_left_x, this.bottom_border_corner_lower_left_y, this.bottom_border_corner_lower_right_x, this.bottom_border_corner_lower_right_y, this.bottom_border_corner_upper_right_x, this.bottom_border_corner_upper_right_y, this.bottom_border_corner_upper_left_x, this.bottom_border_corner_upper_left_y);
    }


    this.show = function()
    {
        push();
        this.draw_top();
        this.draw_left();
        this.draw_right();
        this.draw_bottom();
        pop();
    }
}