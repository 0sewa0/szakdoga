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
setInterval(() => io.sockets.emit('heartbeat', gameState), 5);

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
            connectionCounter++
            socket.emit('spawn', {
                id: socket.id,
                forGuests: data,
                spawnPoint: availableSpawn[Math.floor(Math.random() * availableSpawn.length)],
                guestNumber: guestCounter
            });
        } else {
            socket.emit('goHome', "Already in game!");
        }
    });

    socket.on('start', data => {
        players.push(new Player(data.id, data.user, data.name, data.spawn, data.positionX, data.positionY));
        availableSpawn.splice(availableSpawn.indexOf(data.spawn), 1);
        guestCounter++;
    });

    socket.on('update', data => {
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
                    const oldShot = shots.indexOf(shots.find(s => (s.id == shot.id && s.user == shot.user)));
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
        const shotPlayer = findActivePlayerById(data.targetId);
        if(shotPlayer != undefined) {
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
    });

    socket.on('respawn', () => {
        const respawn = findShotPlayerById(socket.id);
        removeShotPlayer(respawn);
        players.push(respawn);
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