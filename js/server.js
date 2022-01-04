const net = require('net');
const { EventEmitter } = require('stream');
let contactList = [];
let nameList = [];
let updateNameList = false;
let count = 0;
let messageHandler;
let nameTaken = false;
let myEmitter = new EventEmitter();
let server = net.createServer(client => {
    console.log('server is started');
    contactList.push(`${client}`)
    client.write(contactList[count]);
    count++;
    client.on('data', (data) => {
        if (data == "/newname") {
            updateNameList = true;
        } else if (updateNameList == true) {
            for (let i = 0; i < (nameList.length + 1); i++) {
                if (data == nameList[i]) {
                    console.log('Taken name attempt');
                    nameTaken = true;
                }
            }
            if (nameTaken == true) {
                client.write('/taken');
                nameTaken = false;
            } else {
                nameList.push(data.toString().trim());
                client.write('your name has been updated!');
                updateNameList = false;
            }
        } else {
            console.log(`${data.toString().trim()}`);
            messageHandler = `${data.toString().trim()}`;
            myEmitter.emit('message');
        }
    });

    myEmitter.on('message', () => { client.write(messageHandler) });

    process.stdin.on('data', (data) => {
        if (data.toString().trim() == "/list") {
            console.log(nameList)
        } else {
            client.write(`${'server: ' + data.toString().trim()}`)
        }
    });

}).listen(3001);

