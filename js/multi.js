var socket = io.connect('http://71.193.188.235:8080/');
var oppBoard = null;

function onPageLoaded(obj) {
  oppBoard = obj;
  console.log(oppBoard);
}

function sendBoard(board) {
  // console.log(board);
  socket.emit('board', {
    oppBoard: board,
  });
}

socket.on('board', function(data) {
  // console.log(data.oppBoard);
  oppBoard.innerHTML = data.oppBoard;
});
