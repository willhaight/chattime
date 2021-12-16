const net = require('net');

let client = net.createConnection({ port: 3000 }, () => {
    console.log('Client Connected');

    const input =

        input.on('data', (data) => {
            console.log(data);
        })
});