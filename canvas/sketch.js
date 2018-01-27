var player_unit;
var enemy_units = [];

function setup() 
{
	createCanvas(600, 600);
	player_unit = new Unit(0, 0, 40);
	for (let i = 0; i < 10; i++) 
	{
		var r_x = random(-width, width*2);
		var r_y = random(-height, height*2);
		enemy_units[i] = new Unit(r_x, r_y, 40);
	}
}

function draw() 
{
	background(0);
	translate(width/2 - player_unit.body_position.x, height/2 - player_unit.body_position.y);
	for (let i = 0; i < enemy_units.length; i++) {
		enemy_units[i].show();
	}
	player_unit.update();
	player_unit.show();
}
