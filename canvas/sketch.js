let player_unit;
let enemy_units = [];
let border;
let zoom = 1;

function setup() 
{
	createCanvas(CANVAS_SIZE_X, CANVAS_SIZE_Y);	// Creates the area that the player sees
	player_unit = new Unit(0, 0, 1); 			// Creates the player unit
	for (let i = 0; i < 10; i++) 
	{
		//TODO: Actual players
		//Creates the enemy units
		var r_x = random(-CANVAS_MAP_X, CANVAS_MAP_X);
		var r_y = random(-CANVAS_MAP_Y, CANVAS_MAP_Y);
		enemy_units[i] = new Unit(r_x, r_y, i + 2);
	}
}

function draw() 
{
	background(CANVAS_COLOR);
	
	translate(width/2, height/2); 			// Translates the canvas so the player is always in the middle of the screen (the other translate* command is also needed for this to happen)
	let update_zoom = (CANVAS_ZOOM_BASE + player_unit.points * CANVAS_ZOOM_MULTIPLIER) / UNIT_RADIUS;
	zoom = lerp(zoom, update_zoom, 0.2);	// This makes the zoom effect smoother with linear interpolation
	scale(zoom);  							// Scales (zooms in) according the player points, making the game harder
	translate(- player_unit.body_position.x, - player_unit.body_position.y); // *
	show_borders();	//Draw borders
	show_obstacles();
	//Iterate over all the enemy units
	enemy_units.forEach(enemy =>  
		{
			let got_hit = false; // Keeping track if the enemy got hit
			//Iterate over all shots of the player unit
			player_unit.shots.forEach(shot =>
				{
					got_hit = enemy.get_hit(shot) 			// Check if the given shot hit the enemy
					if(got_hit)
					{
						let index = enemy_units.indexOf(enemy);
						enemy_units.splice(index, 1); 		//Removes the enemy unit from the array (consequently removeing it from the game) 
						
						index = player_unit.shots.indexOf(shot);
						player_unit.shots.splice(index, 1); //Removes the shot from the array (consequently removeing it from the game) 
						player_unit.points += 1;
						return;
					}
				});
			if(got_hit){ return; } 			// If the enemy got hit we dont want to draw it, because we removed it from the array earlier, so we have to skip that part or we get an error
			enemy.show();  					// Draws the unit
			if(player_unit.touching(enemy)) // Checks if the player bumped into the enemy 
			{
				player_unit.velocity.rotate(PI).setMag(UNIT_BOUNCE_OFF); //Rotates the direction of the players movement making a bounce effect 
			}
			if(enemy.shots != undefined) 
			{
				//Iterates over all the shots of the enemy unit
				enemy.shots.forEach(shot => 
				{
					if(shot.ttl == 0) 					//Checks if the shot has expired ( A shot expires when its ttl = 0)
					{
						let index = enemy.shots.indexOf(shot);
						enemy.shots.splice(index, 1); 	//Removes the shot from the array (consequently removeing it from the game) 
					}
					else
					{
						shot.show(); 					//Draws the shot
					}
				});
			}
		});
		
	player_unit.move(); // Moves the player unit according to the pushed buttons.
	player_unit.show(); // Draws the player unit
	if(player_unit.shots != undefined)
	{
		//Iterates over the shots of the player unit
		player_unit.shots.forEach(shot => 
			{
				
				if(shot.ttl == 0) 						//Checks if the shot has expired ( A shot expires when its ttl = 0)
				{
					let index = player_unit.shots.indexOf(shot);
					player_unit.shots.splice(index, 1); //Removes the shot from the array (consequently removeing it from the game) 
				}
				else
				{
					shot.show();
				}
			});
	}
}

function mousePressed() // If a button on the mouse is pressed this function triggers 
{
	player_unit.shoot();
}

function show_obstacles()
{
	push();
	noStroke();
    fill(CANVAS_OBSTACLES_COLOR);
	CANVAS_OBSTACLES.forEach(obstacle => {quad(obstacle.x1, obstacle.y1, obstacle.x2, obstacle.y2, obstacle.x3, obstacle.y3, obstacle.x4, obstacle.y4);});
	pop();
}
function show_borders()
{
	push();
	noStroke();
	fill(CANVAS_BORDER_COLOR);
	CANVAS_BORDERS.forEach( border => {quad(border.x1, border.y1, border.x2, border.y2, border.x3, border.y3, border.x4, border.y4);}) 
	pop();
}
