import socketio from 'socket.io-client';

const socket = socketio('http://192.168.15.69:3333', {
  autoConnect: false,
});

function subscribeToNewGraffitis(subscribeFunction) {
  socket.on('new-graffiti', subscribeFunction);
}

function connect(latitude, longitude) {
  socket.io.opts.query = {
    latitude,
    longitude,
  };
  socket.connect();

  socket.on('message', (text) => {
    console.log(text);
  });
}

function disconnect() {
  if (socket.connected) {
    socket.disconnect();
  }
}

export {connect, disconnect, subscribeToNewGraffitis};
