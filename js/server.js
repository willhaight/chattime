const net = require('net');

let server = net.createServer(client => {
    console.log('server is started');

    client.on('data', (data) => {
        console.log(data);
    })

}).listen(3000);

