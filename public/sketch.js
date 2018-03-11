let playerUnit;
let enemyUnits = [];
let border;
let zoom = 1;
let span = [];

let socket;

function setup() {
	createCanvas(CANVAS_SIZE_X, CANVAS_SIZE_Y); // Creates the area that the player sees
	span = CANVAS_SPAN_POINTS();

	socket = io.connect('http://localhost:3000')
	//TODO: Handle disconnecting players

	socket.on('heartbeat',
		function (data) {
			data.players.forEach(player => {
				if (player.id != playerUnit.id) {
					let enemy = enemyUnits.find(e => e.id == player.id);
					if (enemy) {
						enemy.bodyPosition.x = player.positionX;
						enemy.bodyPosition.y = player.positionY;
						enemy.velocity.x = player.velocityX;
						enemy.velocity.y = player.velocityY;
					} else {
						enemyUnits.push(new Unit(player.positionX, player.positionY, player.user, player.id));
					}
				}
			});
			data.shots.forEach(shot => {
				if (shot.user != playerUnit.user) {
					console.log(shot)
					let owner = enemyUnits.find(e => e.user == shot.user);
					let enemyShot = owner.shots.find(s => s.id == shot.id);
					if (enemyShot) {
						enemyShot.position.x = shot.positionX;
						enemyShot.position.y = shot.positionY;
						enemyShot.velocity.x = shot.velocityX;
						enemyShot.velocity.y = shot.velocityY;
						enemyShot.ttl = shot.ttl;
					} else {
						let newShot = new Shot(createVector(shot.positionX, shot.positionY), shot.user, shot.id);
						newShot.velocity = createVector(shot.velocityX, shot.velocityY);
						owner.shots.push(newShot);
					}
				}
			});
		});

	socket.on('span',
		function (data) {
			console.log(data);
			playerUnit = new Unit(span[data.spanPoint].x, span[data.spanPoint].y, 'Guest' + data.spanPoint, data.id); // Creates the player unit
			socket.emit('start', {
				id: playerUnit.id,
				user: playerUnit.user,
				positionX: playerUnit.bodyPosition.x,
				positionY: playerUnit.bodyPosition.y
			});
		});
}

function draw() {
	if (playerUnit) {
		background(CANVAS_COLOR);

		translate(width / 2, height / 2); // Translates the canvas so the player is always in the middle of the screen (the other translate* command is also needed for this to happen)
		let updatedZoom = (CANVAS_ZOOM_BASE + playerUnit.points * CANVAS_ZOOM_MULTIPLIER) / UNIT_RADIUS;
		zoom = lerp(zoom, updatedZoom, 0.2); // This makes the zoom effect smoother with linear interpolation
		scale(zoom); // Scales (zooms in) according the player points, making the game harder
		translate(-playerUnit.bodyPosition.x, -playerUnit.bodyPosition.y); // *
		show_borders(); //Draws borders
		show_obstacles(); //Draws obstacles

		//Iterate over all the enemy units
		enemyUnits.forEach(enemy => {
			let gotHit = false; // Keeping track if the enemy got hit
			//Iterate over all shots of the player unit
			playerUnit.shots.forEach(shot => {
				gotHit = enemy.getHit(shot) // Check if the given shot hit the enemy
				if (gotHit) {
					if (!enemy.shield) {
						let index = enemyUnits.indexOf(enemy);
						enemyUnits.splice(index, 1); //Removes the enemy unit from the array (consequently removeing it from the game)
						playerUnit.points += 1;
					}
					index = playerUnit.shots.indexOf(shot);
					playerUnit.shots.splice(index, 1); //Removes the shot from the array (consequently removeing it from the game)
					return;
				}
			});
			if (gotHit) {
				return;
			} // If the enemy got hit we dont want to draw it, because we removed it from the array earlier, so we have to skip that part or we get an error
			enemy.show(); // Draws the unit
			if (playerUnit.touching(enemy)) // Checks if the player bumped into the enemy
			{
				playerUnit.velocity.rotate(PI).setMag(UNIT_BOUNCE_OFF); //Rotates the direction of the players movement making a bounce effect
			}
			if (enemy.shots != undefined) {
				//Iterates over all the shots of the enemy unit
				enemy.shots.forEach(shot => {
					//Checks if the shot has expired ( A shot expires when its ttl = 0)
					if (shot.ttl <= 0) {
						let index = enemy.shots.indexOf(shot);
						enemy.shots.splice(index, 1); //Removes the shot from the array (consequently removeing it from the game)
					} else {
						shot.show(); //Draws the shot
					}
				});
			}
		});

		playerUnit.move(); // Moves the player unit according to the pushed buttons.
		playerUnit.show(); // Draws the player unit
		if (playerUnit.shots != undefined) {
			//Iterates over the shots of the player unit
			playerUnit.shots.forEach(shot => {

				//Checks if the shot has expired ( A shot expires when its ttl = 0)
				if (shot.ttl <= 0) {
					let index = playerUnit.shots.indexOf(shot);
					playerUnit.shots.splice(index, 1); //Removes the shot from the array (consequently removeing it from the game)
				} else {
					shot.show();
				}
			});
		}
		socket.emit('update', {
			positionX: playerUnit.bodyPosition.x,
			positionY: playerUnit.bodyPosition.y,
			velocityX: playerUnit.velocity.x,
			velocityY: playerUnit.velocity.y,
			shots: parse_shots()
		});
	}
}

 // If a button on the mouse is pressed this function triggers
function mousePressed() {
	playerUnit.shoot();
}

function parse_shots() {
	let shots_to_send = [];
	playerUnit.shots.forEach(shot => {
		shots_to_send.push({
			user: shot.user,
			id: shot.id,
			positionX: shot.position.x,
			positionY: shot.position.y,
			ttl: shot.ttl,
			velocityX: shot.velocity.x,
			velocityY: shot.velocity.y
		});
	});
	return shots_to_send;
}

function show_obstacles() {
	push();
	noStroke();
	fill(CANVAS_OBSTACLES_COLOR);
	CANVAS_OBSTACLES.forEach(obstacle => {
		quad(obstacle.x1, obstacle.y1, obstacle.x2, obstacle.y2, obstacle.x3, obstacle.y3, obstacle.x4, obstacle.y4);
	});
	ellipse(CANVAS_OBSTACLES_CENTER_PIECE.x, CANVAS_OBSTACLES_CENTER_PIECE.y, CANVAS_OBSTACLES_CENTER_PIECE.r1, CANVAS_OBSTACLES_CENTER_PIECE.r2);
	pop();
}

function show_borders() {
	push();
	noStroke();
	fill(CANVAS_BORDER_COLOR);
	CANVAS_BORDERS.forEach(border => {
		quad(border.x1, border.y1, border.x2, border.y2, border.x3, border.y3, border.x4, border.y4);
	})
	pop();
}