const { Socket } = require('dgram');
const net = require('net');
let name = "unamed";
let currentName = "unamed";
let nameChange = false;
let firstMessage = 0;
let connectionId = null;
let kickAdmin = false;
let kickCheck = false;
let incomingWhisper = false;
let whisper = 0;
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
            } else if (data.toString().trim() == "/idBind") {
                client.write(`${connectionId}`)
            } else if (data.toString().trim() == "/nameBound") {
                console.log('Name Succesfully Changed!')
            } else if (data.toString().trim() == "/kickWho") {
                if (kickAdmin == true) {
                    console.log('Who would you like to kick?')
                    kickAdmin = false;
                }
                kickCheck = true
            } else if (kickCheck == true) {
                console.log(`${name} comparing ${data.toString().trim()}`)
                if (data.toString().trim() == name) {
                    Socket.disconnect()
                } else {
                    console.log(`${data.toString().trim()} was kicked from the server`)
                }
                kickCheck = false;
            } else if (data.toString().trim() == '/whisperWho') {
                if (whisper == 1) {
                    console.log('who are you whispering to?')
                    whisper++
                }


            } else if (data.toString().trim() == '/readyForMessage') {
                incomingWhisper = true;
                if (whisper == 5) {
                    console.log('Write your Message')
                    whisper = 2;
                }

            } else if (data.toString().trim() == name && incomingWhisper == true) {
                console.log('DM incoming')
                whisper = 10;
            } else if (incomingWhisper == true && whisper == 5) {
                console.log(`sending message. enter anything to continue`)
                whisper++
            } else if (whisper == 10) {
                console.log(data.toString().trim())
                incomingWhisper = false;
                whisper = 0;
            } else if (incomingWhisper == true && whisper != 10) {
                if (whisper == 100) {
                    whisper = 0;
                    incomingWhisper = false;
                } else {
                    whisper = 100;
                }


            } else if (incomingWhisper == false) {
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
        } else if (data.toString().trim() == "/kick") {
            client.write('/kick');
            kickAdmin = true;
        } else if (nameChange == true) {
            name = data.toString().trim();
            client.write(name);
            nameChange = false;
        } else if (name == "unamed") {
            console.log("You must set a username before chatting. /username to begin.");
        } else if (data.toString().trim() == "/id") {
            console.log(connectionId);
        } else if (kickCheck == true) {
            console.log('finding client')
            client.write(data.toString().trim())
        } else if (data.toString().trim() == '/list') {
            client.write('/giveList')
        } else if (data.toString().trim() == '/w') {
            client.write('/whisper')
            whisper++;
        } else if (whisper == 2) {
            client.write(data.toString().trim())
            whisper = 5;
        } else if (whisper == 6) {
            client.write(name)
            console.log('sending my name')
            whisper = 0;
            incomingWhisper = false;
        }
        else {
            client.write(`${name + ': ' + data.toString().trim()}`)
        }
    });
});