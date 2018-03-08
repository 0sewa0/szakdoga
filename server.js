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
    constructor()
    {
        this.user;
        //TODO: Probably needs an id
        this.position.x;
        this.position.y;
    }
}

let game_state = {players, shots}

setInterval(heartbeat, 16.67);

function heartbeat()
{
    io.sockets.emit('heartbeat',game_state);
}


io.sockets.on('connection',
    function(socket)
    {
        console.log('New Connection: '+ socket.id);
        socket.emit('span',{id: socket.id, span_point: players.length});
        socket.on('start',
            function(data)
            {
                players.push(new Player(data));
            });
        socket.on('update',
            function(data)
            {
                //TODO: Do the actual update of the data on the server
                console.log(data);
            });
    });