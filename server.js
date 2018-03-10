let express = require('express');
let app = express();
let server = app.listen(3000);
app.use(express.static('public'));

console.log('Server On');

let socket = require('socket.io');
let io = socket(server);

let players = [];

class Player
{
    constructor(id, user, position_x, position_y)
    {
        this.id = id;
        this.user = user;
        this.score = 0;

        this.position_x = position_x;
        this.position_y = position_y;

        this.velocity_x = 0;
        this.velocity_y = 0;
    }
}

let shots = [];

class Shot
{
    constructor(user, id, position_x, position_y, ttl)
    {
        this.user = user;
        this.id = id;
        this.position_x = position_x;
        this.position_y = position_y;
        this.ttl = ttl;
    }
}

let game_state = {players, shots}

setInterval( () => io.sockets.emit('heartbeat', game_state), 16.67);



io.sockets.on('connection', socket =>
    {
        console.log('New Connection: '+ socket.id);
        socket.emit('span',{id: socket.id, span_point: players.length});
        socket.on('start', data =>
            {
                players.push(new Player(data.id, data.user, data.position_x, data.position_y));
            });
        socket.on('update', data =>
            {
                let player = players.find( p => p.id == socket.id );

                if(player)
                {
                    player.position_x = data.pos_x;
                    player.position_y = data.pos_y;
                    player.velocity_x = data.vel_x;
                    player.velocity_y = data.vel_y;

                    if(data.shots.length > 0)
                    {
                        data.shots.forEach(shot =>
                            {
                                let old_shot = shots.indexOf( shots.find( s => (s.id == shot.id && s.user == shot.user) ));
                                if(shot.ttl <= 0)
                                {
                                    shots.splice(old_shot, 1);
                                }
                                else if(old_shot >= 0)
                                {
                                    shots[old_shot] = shot;
                                }
                                else
                                {
                                    shots.push( new Shot(shot.user, shot.id, shot.position_x, shot.position_y, shot.ttl));
                                }
                            });
                    }
                    //console.log('----\n'+game_state.shots+'\n----');
                }
                else
                {
                    socket.disconnect();
                }

            });
    });