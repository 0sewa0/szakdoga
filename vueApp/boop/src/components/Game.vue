<template>
  <v-container fluid>
      <div ref="canvas"></div>
  </v-container>
</template>

<script>
import * as params from './gModules/params'
import Unit from './gModules/unit'
import Shot from './gModules/shot'

export default {
    data() {
        return {
            script: null,
            ps: null,
            canvas: null
        }
    },
    mounted () {
        if(!this.$store.getters.getDisplayName) {
            this.$store.dispatch('goHome')
        }
        else{
            this.script = p5 => {
                window.p5 = p5;

                let playerUnit;
                let inGame = false;
                let leaderboard = [];
                let border;
                let zoom = 1;
                let spawn = [];

                //const socket = io.connect('http://localhost:3000')
                const enemyUnits = [];
                p5.setup = _ => {
                    console.log(params)
                    this.canvas = p5.createCanvas(params.CANVAS_SIZE_X, params.CANVAS_SIZE_Y); // Creates the area that the player sees
                    this.canvas.parent(this.$refs.canvas)
                    spawn = params.CANVAS_SPAWN_POINTS();
                    playerUnit = new Unit(spawn[0].x, spawn[0].y, this.$store.getters.getDisplayName, 0, 0);
                    inGame = true;
                    /*socket.on('heartbeat',
                        data => {
                            data.players.forEach(player => {
                                if (playerUnit && player.id != playerUnit.id) {
                                    let enemy = enemyUnits.find(e => e.id == player.id);
                                    if (enemy) {
                                        enemy.bodyPosition.x = player.positionX;
                                        enemy.bodyPosition.y = player.positionY;
                                        enemy.velocity.x = player.velocityX;
                                        enemy.velocity.y = player.velocityY;
                                        enemy.score = player.score;
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
                            leaderboard = data.leaderboard;
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
                            playerUnit.score = 0;
                        });

                    socket.on('playerLeft',
                        data => {
                            if (data.playerId != playerUnit.id) {
                                enemyUnits.splice(enemyUnits.findIndex(l => l == enemyUnits.find(e => e.id == data.playerId)), 1);
                            }
                        });*/
                }

                p5.draw = _ => {
                    if (playerUnit) {
                        p5.background(params.CANVAS_COLOR);
                        p5.translate(p5.width / 2, p5.height / 2); // Translates the canvas so the player is always in the middle of the screen (the other translate* command is also needed for        this to happen)
                        let updatedZoom = (params.CANVAS_ZOOM_BASE + playerUnit.score * params.CANVAS_ZOOM_MULTIPLIER) / params.UNIT_RADIUS;
                        zoom = p5.lerp(zoom, updatedZoom, 0.2); // This makes the zoom effect smoother with linear interpolation
                        p5.scale(zoom); // Scales (zooms in) according the player score, making the game harder
                        p5.translate(-playerUnit.bodyPosition.x, -playerUnit.bodyPosition.y); // *
                        p5.showBorders(); //Draws borders
                        p5.showObstacles(); //Draws obstacles
                        if (inGame) playerUnit.move(); // Moves the player unit according to the pushed buttons.
                        //Iterate over all the enemy units
                        enemyUnits.forEach(enemy => {
                            //Iterate over all shots of the player unit
                            if (inGame) {
                                playerUnit.shots.forEach(shot => {
                                    // Check if the given shot hit the enemy
                                    if (enemy.getHit(shot)) {
                                        if (!enemy.shield) {
                                            playerUnit.score += 1;
                                            /*socket.emit('enemyHit', {
                                                targetId: enemy.id
                                            })*/
                                        }
                                        shot.ttl = 1 //Removes the shot from the array (consequently removeing it from the game)
                                    }
                                });
                                if (playerUnit.touching(enemy)) // Checks if the player bumped into the enemy
                                {
                                    playerUnit.velocity.mult(-params.UNIT_BOUNCE_OFF); //Rotates the direction of the players movement making a bounce effect
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
                        playerUnit.show(inGame); // Draws the player unit
                        /*if (inGame) {
                            socket.emit('update', {
                                positionX: playerUnit.bodyPosition.x,
                                positionY: playerUnit.bodyPosition.y,
                                velocityX: playerUnit.velocity.x,
                                velocityY: playerUnit.velocity.y,
                                shield: playerUnit.shield,
                                score: playerUnit.score,
                                shots: p5.parseShots()
                            });
                        }*/
                    }
                }

                // If a button on the mouse is pressed this function triggers
                p5.mousePressed = _ => {
                    if (inGame) {
                        playerUnit.shoot();
                    }
                }

                p5.keyPressed = _ => {
                    if (p5.keyCode == p5.ENTER && !inGame) {
                        //socket.emit('respawn');
                        inGame = true;
                    }
                }

                p5.parseShots = _ => {
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

                p5.showObstacles = _ => {
                    p5.push();
                        p5.noStroke();
                        p5.fill(params.CANVAS_OBSTACLES_COLOR);
                        params.CANVAS_OBSTACLES.forEach(obstacle => {
                            p5.quad(obstacle.x1, obstacle.y1, obstacle.x2, obstacle.y2, obstacle.x3, obstacle.y3, obstacle.x4, obstacle.y4);
                        });
                        p5.ellipse(params.CANVAS_OBSTACLES_CENTER_PIECE.x, params.CANVAS_OBSTACLES_CENTER_PIECE.y, params.CANVAS_OBSTACLES_CENTER_PIECE.r1,         params.CANVAS_OBSTACLES_CENTER_PIECE.r2);
                    p5.pop();
                    p5.showCenterPieceText();
                }

                p5.showCenterPieceText = _ => {
                    p5.push();
                        p5.textAlign(p5.CENTER);
                        p5.textSize(params.CANVAS_OBSTACLES_CENTER_PIECE.r1 / 13);
                        p5.textStyle(p5.BOLD);
                        p5.fill('rgb(69, 76, 89)');
                        p5.text('LEADERBOARD', params.CANVAS_OBSTACLES_CENTER_PIECE.x, params.CANVAS_OBSTACLES_CENTER_PIECE.y - params.CANVAS_OBSTACLES_CENTER_PIECE.r1 / 8)
                        if(leaderboard) {
                            for (let index = 0; index < leaderboard.length; index++) {
                                textAlign(p5.LEFT);
                                let username = (leaderboard[index].user.length > 8) ? (leaderboard[index].user.substring(0, 8) + "...") : leaderboard[index].user;
                                text(`${index + 1}. ${username}`, params.CANVAS_OBSTACLES_CENTER_PIECE.x - params.CANVAS_OBSTACLES_CENTER_PIECE.r1 / (3 + 0.1 * index),         params.CANVAS_OBSTACLES_CENTER_PIECE.y + (30 * index));
                                textAlign(RIGHT);
                                text(`${leaderboard[index].score}`, params.CANVAS_OBSTACLES_CENTER_PIECE.x + params.CANVAS_OBSTACLES_CENTER_PIECE.r1 / (3 + 0.1 * index),       params.CANVAS_OBSTACLES_CENTER_PIECE.y + (30 * index));
                            }
                        }
                    p5.pop();
                }

                p5.showBorders = _ => {
                    //FIXME: Could be done simpler
                    p5.push();
                        p5.noStroke();
                        p5.fill(params.CANVAS_BORDER_COLOR);
                        params.CANVAS_BORDERS.forEach(border => {
                            p5.quad(border.x1, border.y1, border.x2, border.y2, border.x3, border.y3, border.x4, border.y4);
                        })
                    p5.pop();
                }

                p5.windowResized = _ => {
                    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
                }

            }
            const P5 = require('p5')
            this.ps = new P5(this.script)
        }
  }
}
</script>

<style scoped>
    * { margin:0; padding:0; } /* to remove the top and left whitespace */
    html, body { width:100%; height:100%; } /* just to be sure these are full screen*/
    canvas { display:block; } /* To remove the scrollbars */
</style>
