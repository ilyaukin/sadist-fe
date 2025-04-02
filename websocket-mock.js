const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8090 });
wss.on('connection', function (ws) {
  ws.on('error', console.error);

  ws.on('message', function (message) {
    console.log(`received: %s`, message);
    ws.send(echo(message));
  });
});

/**
 * Mock webscoket. Map test requests to the responses.
 * @param req {string} Incoming message (request)
 */
function echo(req) {
  const obj = JSON.parse(req);
  if ('script' in obj) {
    // return script back to check it in the test
    return JSON.stringify({
      "type": "result",
      "result": [["script"], [obj.script]],
      "session": obj.session,
      "id": obj.id
    });
  }
  if ('method' in obj) {
    return JSON.stringify({
      "type": "result",
      "result": "",
      "session": obj.session,
      "id": obj.id
    });
  }
  return JSON.stringify({
    "type": "error",
    "error": "Unexpected payload: " + req,
    "session": obj.session,
    "id": obj.id
  });
}