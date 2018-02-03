var player_unit;
var enemy_units = [];

function setup() 
{
	createCanvas(CANVAS_SIZE_X, CANVAS_SIZE_Y);	// Creates the area that the player sees
	player_unit = new Unit(0, 0, 1); 			// Creates the player unit
	for (let i = 0; i < 10; i++) 
	{
		//TODO: Actual players
		//Creates the enemy units
		var r_x = random(-width, width*2);
		var r_y = random(-height, height*2);
		enemy_units[i] = new Unit(r_x, r_y, i + 2);
	}
}

function draw() 
{
	background(0);
	translate(width/2 - player_unit.body_position.x, height/2 - player_unit.body_position.y); // Translates the canvas so the player is always in the middle of the screen
	
	//Iterate over all the enemy units
	enemy_units.forEach(enemy =>  
		{
			let got_hit = false; // Keeping track if the enemy got hit
			//Iterate over all shots of the player unit
			player_unit.shots.forEach(shot =>
				{
					got_hit = enemy.get_hit(shot) // Check if the given shot hit the enemy
					if(got_hit)
					{
						let index = enemy_units.indexOf(enemy);
						enemy_units.splice(index, 1); 		//Removes the enemy unit from the array (consequently removeing it from the game) 
						
						index = player_unit.shots.indexOf(shot);
						player_unit.shots.splice(index, 1); //Removes the shot from the array (consequently removeing it from the game) 
						return;
					}
				});
			if(got_hit){ return; } 	// If the enemy got hit we dont want to draw it, because we removed it from the array earlier, so we have to skip that part or we get an error
			
			enemy.show(); // Draws the unit
			if(enemy.shots != undefined)
			{
				//Iterates over all the shots of the enemy unit
				enemy.shots.forEach(shot => 
				{
					if(shot.ttl == 0) //Checks if the shot has expired ( A shot expires when its ttl = 0)
					{
						let index = enemy.shots.indexOf(shot);
						enemy.shots.splice(index, 1); //Removes the shot from the array (consequently removeing it from the game) 
					}
					else
					{
						shot.show(); //Draws the shot
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
				
				if(shot.ttl == 0) //Checks if the shot has expired ( A shot expires when its ttl = 0)
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

