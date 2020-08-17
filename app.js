var createError = require('http-errors');
var express = require('express');
const repo = require('./repositories/main.repository');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var shortId = require('shortid');
var indexRouter = require('./routes/index');

const config = {
  name: 'myproject-backend',
  port: 3000,
  host: '0.0.0.0'
}
var cors = require('cors');    
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors({credentials: true, origin: 'http://localhost:4200'}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
var server = app.listen(config.port, config.host, (e)=> {
  if(e) {
      throw new Error('Internal Server Error');
  }
});
var io = require('socket.io')(server, { origins: '*:*'});
const messages = {}; //id, roomId, content, createdAt, userId
const rooms = {}; //id, name
var messageArr=[];
var roomsArr=[];
var _ = require('lodash');
const { removeListener } = require('process');
io.on('connection', function(socket){
    console.log('a user connected!');
    var readStream = fs.cr
    let previousId;
    const safeJoin = currentId => {
      socket.leave(previousId);
      socket.join(currentId);
      previousId = currentId;
    };
    socket.emit('test', "hellooo")
    socket.on('getRoom',(roomId)=>{
      safeJoin(roomId);
      repo.getMessages(roomId)
      .then((response)=>{
        console.log("messages", Object.values(JSON.parse(JSON.stringify(response))));
        messageArr=JSON.parse(JSON.stringify(response));
        socket.emit("messages", messageArr);
      })
      //socket.emit("messages",messages[roomId]);
    })
    socket.on('createRoom', (users)=>{
      var roomId = shortId.generate();
      var messageId = shortId.generate();
      //roomId, userIdOne, userIdTwo, nameOne, nameTwo
      repo.postRoom(roomId, users.one, users.two, users.nameOne, users.nameTwo);
      //id, roomId, type, sentBy,content
      repo.postMessage(messageId, roomId, "text", shortId.generate(),`start of chat ${roomId}`)
      rooms[roomId] = {room_id:roomId,participants:[users.one, users.two]};
      messages[roomId]={
        room_id: roomId,
        history:[{content: `start of chat ${roomId}`, sent_by:'no one sent this'}]
      };
      roomsArr.push({id: roomId, room_name: users.nameOne})
      io.emit('rooms',roomsArr)
    });
    socket.on('chatrooms', (userId)=>{
      //var roomList=[];
      console.log('GET CHATROOMS');
      repo.getUserRooms(userId)
      .then((response)=>{
        roomsArr = Object.values(JSON.parse(JSON.stringify(response)))//response.map(a => a.id);
        console.log("key Results",roomsArr);
        
        socket.emit("rooms",roomsArr); 
      })  
    });
    socket.on('new-message', (data) => {
      //messages[data.room_id].history.push(data.message);
      id = shortId.generate();
      //id, roomId, type, sentBy,content
      var messageObj = {
        id: id,
        room_id: data.room_id,
        content: data.message.content,
        sent_by: data.message.sent_by
      }
      messageArr.push(JSON.parse(JSON.stringify(messageObj)));
      //console.log(messageArr);
      repo.postMessage(id, data.room_id, "text", data.message.sent_by,data.message.content)
      io.in(data.room_id).emit('new-message',JSON.parse(JSON.stringify(messageObj)));

    });
    socket.on('typing', (data) => {
      socket.broadcast.in(data.room_id).emit('typing', {data: data, isTyping: true});
    });
    //io.emit("rooms",Object.keys(rooms)); 
}); 
module.exports = app;
