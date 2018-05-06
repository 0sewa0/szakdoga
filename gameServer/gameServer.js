//Imports
const express = require('express');
const socket = require('socket.io');
const Player = require('./model/player')
const Shot = require('./model/shot')

//Server init
const app = express();
const server = app.listen(3000);
console.log('Server On');
const io = socket(server);
let connectionCounter = 0;

//Game state init
const availableSpawn = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
let guestCounter = 0;
const players = [];
const shotPlayers = [];
const leaderboard = [];
const shots = [];
const gameState = {
    players,
    shots,
    leaderboard
}


//Game server logic
//setInterval(() => io.sockets.emit('heartbeat', gameState), 5);

io.sockets.on('connection', socket => {
    console.log(`New Connection: ${socket.id}`);
    if(connectionCounter >= 12) {
        socket.emit('goHome', "Server full");
    }
    socket.on('userCheck', data => {
        if(!data) {
            data = 'GUEST' + guestCounter;
            guestCounter++;
        }
        if(!findUser(data)) {
            connectionCounter++;
            socket.emit('spawn', {
                id: socket.id,
                forGuests: data,
                spawnPoint: availableSpawn[Math.floor(Math.random() * availableSpawn.length)],
            });
        } else {
            socket.emit('goHome', "Already in game!");
        }
    });

    socket.on('start', data => {
        if(data.user != null && data.id != null && data.name != null && data.spawn != null && data.positionX != null && data.positionY != null && !findUser(data.user)) {
            players.push(new Player(data.id, data.user, data.name, data.spawn, data.positionX, data.positionY));
            availableSpawn.splice(availableSpawn.indexOf(data.spawn), 1);
        }
        else {
            error(socket, 'Error: start event => Invalid payload: ' + data +'\nFrom socket ' + socket.id);
        }
    });

    socket.on('update', data => {

        if(data.positionX != null && data.positionY != null && data.velocityX != null && data.velocityY != null && data.shield != null && data.score != null) {
            const player = findActivePlayerById(socket.id);
            if (player) {
                player.positionX = data.positionX;
                player.positionY = data.positionY;
                player.velocityX = data.velocityX;
                player.velocityY = data.velocityY;
                player.shield = data.shield;
                player.score = data.score;
                if(player.score > player.bestScore) {
                    player.bestScore = player.score;
                    checkLeaderboard(player);
                }
                if (data.shots.length > 0) {
                    data.shots.forEach(shot => {
                        if(shot.id != null && shot.positionX != null && shot.velocityX != null && shot.velocityY != null && shot.ttl != null) {
                            const oldShot = shots.indexOf(shots.find(s => (s.id == shot.id && s.user == player.user)));
                            if (oldShot >= 0 && shot.ttl <= 0) {
                                shot.user = player.user;
                                shots[oldShot] = shot;
                                io.sockets.emit('heartbeat', gameState)
                                shots.splice(oldShot, 1);
                            } else if (oldShot >= 0) {
                                shot.user = player.user;
                                shots[oldShot] = shot;
                            } else {
                                shots.push(new Shot(player.user, shot.id, shot.positionX, shot.positionY, shot.velocityX, shot.velocityY, shot.ttl));
                            }
                        }
                        else {
                            error(socket, 'Error: update event => Invalid shot payload: ' + shot  +'\nFrom socket ' + socket.id);
                        }
                    });
                }
            }
        }
        else {
            error(socket, 'Error: update event => Invalid payload: ' + data +'\nFrom socket ' + socket.id);
        }
        io.sockets.emit('heartbeat', gameState)
    });

    socket.on('enemyHit', data => {
        if(data.targetId != null) {
            const shotPlayer = findActivePlayerById(data.targetId);
            if(shotPlayer != null) {
                shotPlayer.score = 0;
                shotPlayers.push(shotPlayer);
                removeActivePlayer(shotPlayer);
                io.to(data.targetId).emit('gotHit', {
                    shooterId: socket.id
                });
                io.sockets.emit('playerLeft', {
                    playerId: data.targetId
                });
            }
            else {
                error(socket, 'Error: enemyHit event => No active player corresponding to targetId: ' + data.targetId +"\nFrom socket: "+ socket.id);
            }
        }
        else {
            error(socket, 'Error: enemyHit event => Invalid payload: ' + data +"\nFrom socket: "+ socket.id);
         }
    });

    socket.on('respawn', () => {
        const respawn = findShotPlayerById(socket.id);
        if(respawn) {
            removeShotPlayer(respawn);
            players.push(respawn);
        }
        else {
            error(socket, 'Error: respawn event => No inactive player corresponding to socket: ' + socket.id);
        }
    });

    socket.on('disconnect', () => {
        console.log(`Connection lost: ${socket.id}`);
        connectionCounter--
        const leaver = findPlayerById(socket.id);
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

//Util functions

findPlayerById = (playerId) => {
    const player = findActivePlayerById(playerId);
    if (player != undefined) {
        return player
    }
    return findShotPlayerById(playerId);
}

findShotPlayerById = (playerId) => {
    return shotPlayers.find(p => p.id == playerId);
}

findActivePlayerById = (playerId) => {
    return players.find(p => p.id == playerId);
}

removePlayer = (player) => {
    return (removeShotPlayer(player)) ? true : removeActivePlayer(player);
}

removeShotPlayer = (player) => {
    const index = shotPlayers.findIndex(p => p == player)
    return (index != -1) ? shotPlayers.splice(index, 1) | true : false;
}

removeActivePlayer = (player) => {
    const index = players.findIndex(p => p == player)
    return (index != -1) ? players.splice(index, 1) | true : false;
}

checkLeaderboard = (player) => {

    const champ = leaderboard.find( leader => leader.user == player.user)
    if(champ) {
        champ.score++;
        leaderboard.sort((a,b) => a.score < b.score);
    }
    else if( leaderboard.length < 3 ) {
        leaderboard.push({user: player.name, score: player.bestScore});
        leaderboard.sort((a,b) => a.score < b.score);
    }
    else if(leaderboard.some( leader => leader.score < player.bestScore)) {
        leaderboard[2] = {user: player.name, score: player.bestScore};
        leaderboard.sort((a,b) => a.score < b.score);
    }
}

findUser = (user) => {
    const index = players.findIndex( p => p.user == user);
    return (index != -1) ? true : false;
}

error = (socket, message) => {
    console.log(message);
    socket.emit("event_error", message);
}