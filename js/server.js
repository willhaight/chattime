const net = require('net');
const { EventEmitter } = require('stream');
let contactList = [];
let nameList = [];
let updateNameList = false;
let idBind = false;
let storedName = null;
let count = 0;
let kickHandle = false;
let messageHandler;
let whisperStatus = 0;
let nameTaken = false;
let myEmitter = new EventEmitter();
let server = net.createServer(client => {
    nameList.push('unamed')
    console.log('server is started');
    client.write(`${count}`);
    contactList.push(`${client}`)
    count++
    client.on('data', (data) => {


        if (idBind == true) {
            console.log('binding')
            let id = Number(data.toString().trim())
            nameList.splice(id, 1, storedName);
            idBind = false;
            client.write('/nameBound')
        } else
            if (data == "/newname") {
                updateNameList = true;
            } else if (data.toString().trim() == "/kick") {
                kickHandle = true;
                messageHandler = '/kickWho';
                myEmitter.emit('kickReady');
                console.log('readying kick')
            } else if (kickHandle == true) {
                messageHandler = `${data.toString().trim()}`;
                for (let i = 0; i < nameList.length; i++) {
                    if (data.toString().trim() == nameList[i]) {
                        nameList.splice(i, 1, 'unamed')
                    }
                }
                myEmitter.emit('kick');
                kickHandle = false;
            } else if (data.toString().trim() == "/giveList") {
                client.write(`${nameList}`)
            } else if (data.toString().trim() == "/whisper") {
                client.write('/whisperWho');
                whisperStatus++;
            } else if (whisperStatus == 1) {
                storedName = data.toString().trim()
                whisperStatus++
                myEmitter.emit('whisperReady')
                console.log(`captured whisper to ${storedName}`)
            } else if (whisperStatus == 2) {
                messageHandler = data.toString().trim()
                myEmitter.emit('whisperNameCheck');
                whisperStatus++
            } else if (whisperStatus == 3) {
                messageHandler = `${messageHandler}: ` + 'from ' + `${data.toString().trim()}`
                myEmitter.emit('whisper')
                whisperStatus = false;
            }









            else if (updateNameList == true) {
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
                    client.write("/idBind");
                    idBind = true;
                    storedName = data.toString().trim();
                    updateNameList = false;
                }
            } else {
                if (data.toString().trim() == "/idRecieved") {
                    client.write('hi')
                } else {
                    console.log(`${data.toString().trim()}`);
                    messageHandler = `${data.toString().trim()}`;
                    myEmitter.emit('message');
                }
            }
    });
    myEmitter.on('message', () => { client.write(messageHandler) });
    myEmitter.on('kick', () => { client.write(messageHandler) });
    myEmitter.on('kickReady', () => { client.write(messageHandler) });
    myEmitter.on('whisper', () => { client.write(messageHandler) });
    myEmitter.on('whisperReady', () => { client.write('/readyForMessage') });
    myEmitter.on('whisperNameCheck', () => { client.write(storedName) });

    process.stdin.on('data', (data) => {
        if (data.toString().trim() == "/list") {
            console.log(nameList)
        } else {
            client.write(`${'server: ' + data.toString().trim()}`)
        }
    });

}).listen(3001);

