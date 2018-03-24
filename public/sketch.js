let playerUnit;
let inGame = false;

let enemyUnits = [];
let border;
let zoom = 1;
let spawn = [];

let socket;

function setup() {
	createCanvas(CANVAS_SIZE_X, CANVAS_SIZE_Y); // Creates the area that the player sees
	spawn = CANVAS_SPAWN_POINTS();

	socket = io.connect('http://localhost:3000')

	socket.on('heartbeat',
		data => {
			data.players.forEach(player => {
				if (player.id != playerUnit.id) {
					let enemy = enemyUnits.find(e => e.id == player.id);
					if (enemy) {
						enemy.bodyPosition.x = player.positionX;
						enemy.bodyPosition.y = player.positionY;
						enemy.velocity.x = player.velocityX;
						enemy.velocity.y = player.velocityY;
						enemy.shield = player.shield;
					} else {
						enemyUnits.push(new Unit(player.positionX, player.positionY, player.user, player.id, player.spawn));
					}
				}
			});
			data.shots.forEach(shot => {
				if (shot.user != playerUnit.user) {
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

	socket.on('spawn',
		data => {
			playerUnit = new Unit(spawn[data.spawnPoint].x, spawn[data.spawnPoint].y, 'Guest' + data.guestNumber, data.id, data.spawnPoint); // Creates the player unit
			socket.emit('start', {
				id: playerUnit.id,
				user: playerUnit.user,
				positionX: playerUnit.bodyPosition.x,
				positionY: playerUnit.bodyPosition.y,
				spawn: data.spawnPoint
			});
			inGame = true;
		});

	socket.on('gotHit',
		data => {
			inGame = false;
			playerUnit.bodyPosition.x = spawn[playerUnit.spawn].x;
			playerUnit.bodyPosition.y = spawn[playerUnit.spawn].y;
			playerUnit.points = 0;
			//TODO: Add a respawn option
			//TODO: Add score handling on the server and client side
		});

	socket.on('playerLeft',
		data => {
			if (data.playerId != playerUnit.id) {
				enemyUnits.splice(enemyUnits.findIndex(l => l == enemyUnits.find(e => e.id == data.playerId)), 1);
			}
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
		showBorders(); //Draws borders
		showObstacles(); //Draws obstacles
		if (inGame) playerUnit.move(); // Moves the player unit according to the pushed buttons.
		//Iterate over all the enemy units
		enemyUnits.forEach(enemy => {
			//Iterate over all shots of the player unit
			if (inGame) {
				playerUnit.shots.forEach(shot => {
					// Check if the given shot hit the enemy
					if (enemy.getHit(shot)) {
						if (!enemy.shield) {
							playerUnit.points += 1;
							socket.emit('enemyHit', {
								targetId: enemy.id
							})
						}
						shot.ttl = 1 //Removes the shot from the array (consequently removeing it from the game)
					}
				});
				if (playerUnit.touching(enemy)) // Checks if the player bumped into the enemy
				{
					playerUnit.velocity.mult(-UNIT_BOUNCE_OFF); //Rotates the direction of the players movement making a bounce effect
				}
			}
			enemy.show(); // Draws the unit
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
		playerUnit.shots.forEach(shot => {
			//Checks if the shot has expired ( A shot expires when its ttl = 0)
			if (shot.ttl <= 0) {
				let index = playerUnit.shots.indexOf(shot);
				playerUnit.shots.splice(index, 1); //Removes the shot from the array (consequently removeing it from the game)
			} else {
				shot.show();
			}
		});
		playerUnit.show(); // Draws the player unit
		if (inGame) {
			socket.emit('update', {
				positionX: playerUnit.bodyPosition.x,
				positionY: playerUnit.bodyPosition.y,
				velocityX: playerUnit.velocity.x,
				velocityY: playerUnit.velocity.y,
				shield: playerUnit.shield,
				shots: parseShots()
			});
		}
	}
}

// If a button on the mouse is pressed this function triggers
function mousePressed() {
	if (inGame) {
		playerUnit.shoot();
	}
}

function parseShots() {
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

function showObstacles() {
	push();
	noStroke();
	fill(CANVAS_OBSTACLES_COLOR);
	CANVAS_OBSTACLES.forEach(obstacle => {
		quad(obstacle.x1, obstacle.y1, obstacle.x2, obstacle.y2, obstacle.x3, obstacle.y3, obstacle.x4, obstacle.y4);
	});
	ellipse(CANVAS_OBSTACLES_CENTER_PIECE.x, CANVAS_OBSTACLES_CENTER_PIECE.y, CANVAS_OBSTACLES_CENTER_PIECE.r1, CANVAS_OBSTACLES_CENTER_PIECE.r2);
	pop();
}

function showBorders() {
	push();
	noStroke();
	fill(CANVAS_BORDER_COLOR);
	CANVAS_BORDERS.forEach(border => {
		quad(border.x1, border.y1, border.x2, border.y2, border.x3, border.y3, border.x4, border.y4);
	})
	pop();
}