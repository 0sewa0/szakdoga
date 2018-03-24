let express = require('express');
let app = express();
let server = app.listen(3000);
app.use(express.static('public'));

console.log('Server On');

let socket = require('socket.io');
let io = socket(server);


let availableSpawn = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
let guestCounter = 0;

let players = [];
let shotPlayers = [];

class Player {
    constructor(id, user, spawn, positionX, positionY) {
        this.id = id;
        this.user = user;
        this.score = 0;

        this.spawn = spawn
        this.positionX = positionX;
        this.positionY = positionY;

        this.velocityX = 0;
        this.velocityY = 0;

        this.shield = false;
    }
}

let shots = [];

class Shot {
    constructor(user, id, positionX, positionY, velocityX, velocityY, ttl) {
        this.user = user;
        this.id = id;
        this.positionX = positionX;
        this.positionY = positionY;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.ttl = ttl;
    }
}

let gameState = {
    players,
    shots
}

setInterval(() => io.sockets.emit('heartbeat', gameState), 5);



io.sockets.on('connection', socket => {
    console.log('New Connection: ' + socket.id);

    socket.emit('spawn', {
        id: socket.id,
        spawnPoint: availableSpawn[Math.floor(Math.random() * availableSpawn.length)],
        guestNumber: guestCounter
    });

    socket.on('start', data => {
        players.push(new Player(data.id, data.user, data.spawn, data.positionX, data.positionY));
        availableSpawn.splice(availableSpawn.indexOf(data.spawn), 1);
        guestCounter++;
    });

    socket.on('update', data => {
        let player = findPlayerById(socket.id);

        if (player) {
            player.positionX = data.positionX;
            player.positionY = data.positionY;
            player.velocityX = data.velocityX;
            player.velocityY = data.velocityY;
            player.shield = data.shield;
            if (data.shots.length > 0) {
                data.shots.forEach(shot => {
                    let oldShot = shots.indexOf(shots.find(s => (s.id == shot.id && s.user == shot.user)));
                    if (shot.ttl <= 0) {
                        shots.splice(oldShot, 1);
                    } else if (oldShot >= 0) {
                        shots[oldShot] = shot;
                    } else {
                        shots.push(new Shot(shot.user, shot.id, shot.positionX, shot.positionY, shot.velocityX, shot.velocityY, shot.ttl));
                    }
                });
            }
        }
    });

    socket.on('enemyHit', data => {
        let shotPlayer = findPlayerById(data.targetId);
        shotPlayers.push(shotPlayer);
        removePlayer(shotPlayer);
        io.to(data.targetId).emit('gotHit', {
            shooterId: socket.id
        });
        io.sockets.emit('playerLeft', {
            playerId: data.targetId
        });
    });

    socket.on('disconnect', () => {
        console.log('Connection lost: ' + socket.id);
        let leaver = findPlayerById(socket.id);
        if (leaver) {
            availableSpawn.push(leaver.spawn);
            shots.filter(s => s.user == leaver.user).forEach(shot => shots.splice(shots.findIndex(s => s == shot), 1));
            removePlayer(leaver);
            io.sockets.emit('playerLeft', {
                playerId: socket.id
            });
        }
    });
});

function findPlayerById(playerId) {
    let player = players.find(p => p.id == playerId);
    if (player != undefined) {
        return player
    }
    return shotPlayers.find(p => p.id == playerId);
}

function removePlayer(player) {
    players.splice(players.findIndex(p => p == player), 1);
    shotPlayers.splice(shotPlayers.findIndex(p => p == player), 1);
}