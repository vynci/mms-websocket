var mqtt = require('mqtt');
var server = require('http').createServer();
var io = require('socket.io')(server);
var port = Number(process.env.PORT || 4444);

var mqttClient = mqtt.connect({
	host : '188.166.184.34',
	port : 6969,
	username : 'pipeeroac05c207b',
	password : '5738921e589fcb114312db62'
});

// listen to messages coming from websocket clients
io.sockets.on('connection', function (socket) {
	socket.on('subscribe', function (data) {
		console.log('Subscribing to ' + data);
		socket.join(data);
	});
});

// listen to messages coming from the mqtt broker
mqttClient.on('message', function (topic, payload, packet) {
	var obj = JSON.parse(payload);

	console.log('topic: ', topic);
	console.log(obj);

	if(topic === 'listen/message/rest-api'){
		obj.members.forEach(function(member){
			if(member.toString() !== obj.author.toString()){
				console.log('published to: ' + 'message/' + member);
				io.sockets.in('message/' + member).emit('message-received', obj);
			}
		});
	}
});

mqttClient.on('connect', function () {
	console.log('new connection');
	mqttClient.subscribe('listen/message/rest-api');
});

server.listen(port);
