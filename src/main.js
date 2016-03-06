const stats = require('./stats.js');

const io = require('socket.io')();

/**
 * Main entry point.
 */
function main () {
  var statsClient = new stats.Client();
  statsClient.connect('https://es.seestats.org');

  io.on('connection', (socket) => {
    socket.on('get_event_count', (data) => {
      statsClient.startFetchingStats(socket, data);
    });
  });
  io.listen(3000);
}

main()
