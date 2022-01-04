const net = require('net');
let name = "unamed";
let currentName = "unamed";
let nameChange = false;
let firstMessage = true;

let client = net.createConnection({ port: 3001 }, () => {
    console.log('Client Connected');
    client.on('data', (data) => {
        if (firstMessage == true) {
            console.log(`type /username`);
            firstMessage = false;
        } else if (firstMessage == false) {
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
            client.write("/newname");
            console.log('type new name.');
            nameChange = true;
        } else if (nameChange == true) {
            name = data.toString().trim();
            console.log(`Your name is now ${name}`);
            let newArr = [];
            newArr.push(data.toString().trim());
            newArr.push(currentName);
            console.log(`I am newArr ${newArr}`)
            client.write(newArr.toString());
            nameChange = false;
        } else if (name == "unamed") {
            console.log("You must set a username before chatting. /username to begin.");
        }
        else {
            client.write(`${name + ': ' + data.toString().trim()}`)
        }
    });
});