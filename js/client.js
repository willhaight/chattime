const { Socket } = require('dgram');
const net = require('net');
let name = "unamed";
let currentName = "unamed";
let nameChange = false;
let firstMessage = 0;
let connectionId = null;

let client = net.createConnection({ port: 3001 }, () => {
    console.log('Client Connected');
    client.on('data', (data) => {
        if (firstMessage == 0) {
            if (typeof Number(data.toString().trim()) == 'number' && Number(data.toString().trim()) != NaN) {
                connectionId = data.toString().trim();
                client.write('/idRecieved')
                firstMessage++
            }
        } else if (firstMessage == 1) {
            console.log(`type /username`);
            firstMessage++;
        } else if (firstMessage == 2) {
            if (data.toString().trim() == "/taken") {
                console.log('That name is currently unavailable')
                name = "unamed";
            } else {
                console.log(`${data}`);
            }
        }
    });
    process.stdin.on('data', (data) => {
        if (data.toString().trim() == "/username") {
            currentName = name;
            console.log('type new name.');
            client.write('/newname')
            nameChange = true;
        } else if (nameChange == true) {
            name = data.toString().trim();
            client.write(name);
            nameChange = false;
        } else if (name == "unamed") {
            console.log("You must set a username before chatting. /username to begin.");
        } else if (data.toString().trim() == "/kick") {
            Socket.disconnect();
        } else if (data.toString().trim() == "/id") {
            console.log(connectionId);
        }
        else {
            client.write(`${name + ': ' + data.toString().trim()}`)
        }
    });
});