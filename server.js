let express = require('express');
let app = express();
let server = app.listen(3000);
app.use(express.static('public'));

console.log('Server On');

let socket = require('socket.io');
let io = socket(server);

let players = [];

class Player {
    constructor(id, user, positionX, positionY) {
        this.id = id;
        this.user = user;
        this.score = 0;

        this.positionX = positionX;
        this.positionY = positionY;

        this.velocityX = 0;
        this.velocityY = 0;
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

let gameState = { players, shots }

setInterval(() => io.sockets.emit('heartbeat', gameState), 16.67);



io.sockets.on('connection', socket => {
    console.log('New Connection: ' + socket.id);
    socket.emit('span', {
        id: socket.id,
        spanPoint: players.length
    }); // FIXME: Span points are problematic if someone disconnects, also Guest usernames

    socket.on('start', data => {
        players.push(new Player(data.id, data.user, data.positionX, data.positionY));
    });

    socket.on('update', data => {
        let player = players.find(p => p.id == socket.id);

        if (player) {
            player.positionX = data.positionX;
            player.positionY = data.positionY;
            player.velocityX = data.velocityX;
            player.velocityY = data.velocityY;

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
            //console.log('----\n'+gameState.shots+'\n----');
        } else {
            socket.disconnect();
        }

    });

    socket.on('disconnect', () => {
        let leaver = players.find(p => p.id == socket.id);
        shots.filter(s => s.user == leaver.user).forEach(shot => shots.splice(shots.findIndex(s => s == shot), 1));
        players.splice(players.findIndex(l => l == leaver), 1);
    });
});