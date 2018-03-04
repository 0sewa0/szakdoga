let player_unit;
let enemy_units = [];
let border;
let zoom = 1;
let span = [];

let socket;

function setup()
{
	createCanvas(CANVAS_SIZE_X, CANVAS_SIZE_Y);	// Creates the area that the player sees
	span = CANVAS_SPAN_POINTS();

	socket = io.connect('http://localhost:3000')

	socket.on('heartbeat',
		function(data)
		{
			//TODO: Update the game state according to the data
			console.log(data);
		});
	socket.on('span',
		function(data)
		{
			console.log(data);
			player_unit = new Unit(span[data.span_point].x, span[data.span_point].y, 'Guest'+data.span_point, data.id);  // Creates the player unit
			socket.emit('start',
				{
					id: player_unit.id,
					user: player_unit.user,
					position_x: player_unit.body_position.x,
					position_y: player_unit.body_position.y
				});
		});
}

function draw()
{
	if(player_unit)
	{
		background(CANVAS_COLOR);

		translate(width/2, height/2); 			// Translates the canvas so the player is always in the middle of the screen (the other translate* command is also needed for this to happen)
		let update_zoom = (CANVAS_ZOOM_BASE + player_unit.points * CANVAS_ZOOM_MULTIPLIER) / UNIT_RADIUS;
		zoom = lerp(zoom, update_zoom, 0.2);	// This makes the zoom effect smoother with linear interpolation
		scale(zoom);  							// Scales (zooms in) according the player points, making the game harder
		translate(- player_unit.body_position.x, - player_unit.body_position.y); // *
		show_borders();		//Draws borders
		show_obstacles();	//Draws obstacles

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
							if(!enemy.shield)
							{
								let index = enemy_units.indexOf(enemy);
								enemy_units.splice(index, 1); 		//Removes the enemy unit from the array (consequently removeing it from the game)
								player_unit.points += 1;
							}
							index = player_unit.shots.indexOf(shot);
							player_unit.shots.splice(index, 1); //Removes the shot from the array (consequently removeing it from the game)
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
						if(shot.ttl <= 0) 					//Checks if the shot has expired ( A shot expires when its ttl = 0)
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

					if(shot.ttl <= 0) 						//Checks if the shot has expired ( A shot expires when its ttl = 0)
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
		socket.emit('update',
			{
				pos_x: player_unit.body_position.x,
				pos_y: player_unit.body_position.y,
				vel_x: player_unit.velocity.x,
				vel_y: player_unit.velocity.y,
				shots: '' //TODO: / FIXME: Rework how shots are stored, currently it would be a pain to send them back and forth
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
	ellipse(CANVAS_OBSTACLES_CENTER_PIECE.x, CANVAS_OBSTACLES_CENTER_PIECE.y, CANVAS_OBSTACLES_CENTER_PIECE.r1, CANVAS_OBSTACLES_CENTER_PIECE.r2);
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
