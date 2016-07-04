/*
	chat client
*/

var net = require('net')

var svrPort = 8765;
var client = new net.Socket();
var isLogin = false;
var account = "";

client.setEncoding('utf8');
client.connect(svrPort, 'localhost', function(){
	console.log('connect server success!');
})

client.on('error', function(err){
	console.log('encountor an error!');
});

client.on('data', dealClient);

function dealClient(data){
	if(data=='__LOGIN__IN'){
		login()
	}else if(data=='__LOGIN__ERROR'){
		console.log('account already exsit, please check...');
		login();
	}else if(data == '__LOGIN__OK'){
		isLogin = true;
		console.log('login ok!');
	}else{
		console.log(data);
	}
}

function login(){
	console.log('please enter your account:');
}

// console enter msg
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data){
	var data = data.slice(0,data.length-2);
	if(isLogin){
		client.write(account+":"+data);
	}else{
		client.write('__LOGIN__:' + data);
		account = data;
	}
});
