const connectSocket = function (cb) {
    // 创建websocket连接
    window.webSocket = new WebSocket('ws://localhost:8082/websocket');
    // window.webSocket = new WebSocket('ws://172.20.0.21:8082/websocket');
    
    // 建立连接
    webSocket.onopen = evt => {
        console.log("webSocket连接成功");
        // let data = {type: 'bind'}
        // let json = JSON.stringify(data);
        // webSocket.send(json);
    }

    // 连接关闭
    webSocket.onclose = evt => {
        console.log("webSocket连接关闭");
    }

    // 接收服务器推送消息
    webSocket.onmessage = evt => {
        cb(evt.data)
    }

    // 连接发生错误时
    webSocket.onerror = (evt,e) => {
        console.log("webSocket连接失败")
        console.log(evt)
    }
}

export default connectSocket;