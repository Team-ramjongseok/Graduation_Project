


module.exports = (server) => {

  const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
  });

  
  const a = io.on('connection', (socket) => { // 웹소켓 연결 시

    let cafeId;

    const emitData = () => {
      console.log("event occur from " + cafeId);
    }


    console.log("cafeId ===", cafeId);
    const req = socket.request; // request는 ws와는 다르게 socket 안에 들어있다.
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip); // 고유한 소켓 id가 들어있다.

    

    socket.on('disconnect', () => { // 연결 종료 시
      console.log('클라이언트 접속 해제', ip, socket.id, cafeId);
      process.removeAllListeners(cafeId); // 클라이언트 접속 해제시, 
    });

    socket.on('error', (error) => { // 에러 시
      console.error(error);
    });

    socket.on('reply', (data) => { // 클라이언트로부터 메시지
        cafeId = data;
        console.log(data);
       
        process.on(data, (event) => {
          console.log("결제 발생, event : ", event);
          socket.emit(data, emitData);
        }); // 이벤트 리스너 등록. 만약에 결제 완료가 되는 경우, 클라이언트쪽에서 결제목록 바꾸도록
        

    });

    

  });

};