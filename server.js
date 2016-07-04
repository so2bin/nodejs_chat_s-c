/*
  server  for chatting
*/
var net = require('net');
var svrPort = 8765;

// client
function Client(name,socket,ip,port){
	this.name = name;
	this.socket = socket;
	this.IP = ip;
	this.port = port;
}

// client manager
function ClientManager(){
	this.clients = [];
	this.clientNum = 0;
	this.findClient = function(name){
		return this.clients[name];
	}
	this.addClient = function(client){
		var cl = this.findClient(clients.name);
		if(cl){
			this.clients[client.name] = client;
		}
		else{
			this.clients[client.name] = client;
			++this.clientNum;
		}
	}
	this.delClient = function(name){
		if(this.findClient(name)){
			delete this.clients[name];
			--this.clientNum;
		}
	}
}

var cltMgr = new ClientManager();

var svr = net.createServer();
svr.listen(svrPort,'localhost');

// new client connection
svr.on('connection', connectFunc);

function connectFunc(socket){
	socket.setEncoding('utf8');
	var svrAdr = socket.address();
	var client = new Client("",socket,svrAdr.address, svrAdr.port);
	socket.write('__LOGIN__IN');
	console.log("connection is create from %j" , svrAdr.address);
	dealClient(socket, client);

	socket.on('error', function(err){
		console.log('encountor an error with %j', svrAdr.address);
		cltMgr.delClient(client.name);
		socket.destroy();
	});
	socket.on('end', function(){
		console.log('client connection is end!');
	});
}

function dealClient(socket, client){
	var svrAdr = socket.address();
	socket.on('data',function(data){
		console.log('recv msg: ' + data);
		if(/__LOGIN__/.test(data)){
			var acc = data.match(/__LOGIN__:(\S+)/)[1];
			if(cltMgr.findClient(acc)){
				socket.write("__LOGIN_ERROR");
			}else{
				socket.write('__LOGIN__OK');
				console.log('client %j login ok!', acc);
				client.name = acc;
				cltMgr.addClient(client);
			}
		}else{
			broadCast(data);
		}
	})
}

// broad cast msg
function broadCast(data) {
	console.log('server echo msg to client...');
	for(var clt in cltMgr.clients){
		cltMgr.findClient(clt).socket.write(data);
	}
}
