var http = require('http');
var fs = require("fs");
//var connect = require('connect');
//var serveStatic = require('serve-static');


var PORT = process.env.PORT || 8089;

var topicList = [];
var topicDetail = {};
var currentId = 123;

//add topic
function addTopic(tTitle, tText) {
  console.log("addTopic(" + tTitle + "," + tText + ")");
  var topicId = ++currentId;
  topicList.push({title: tTitle, id: topicId});
  topicDetail[topicId] = {title: tTitle, text: tText, comments: []};
  return topicId;
}

//add comment
function addComment(topicId, text) {
  console.log("addComment(" + topicId + "," + text + ")");
  topicDetail[topicId].comments.push(text);
}

//initial state elements
var id1 = addTopic("Topic 1","Topic 1 content");
var id2 = addTopic("Topic 2","Topic 2 content");
addComment(id1, "Good topic");
addComment(id2, "This is a comment");
addComment(id2, "This is another comment");

//RESTful request handler
function handleRequest(request, response, requestBody) {
  console.log(request.method + ":" + request.url + ' >>' + requestBody);
  if (request.url == '/') {
    if (request.method == 'POST') {
      var jsonMsg = JSON.parse(requestBody);
      addTopic(jsonMsg.title, jsonMsg.text);
      response.end();
    } else {
      response.end(JSON.stringify(topicList));
    }
  } else {
    var topicId = request.url.substring(1);
    if (request.method == 'POST') {
      var jsonMsg = JSON.parse(requestBody);
      addComment(jsonMsg.topicId, jsonMsg.text);
      response.end();
    } else {
      response.end(JSON.stringify(topicDetail[topicId]));
    }
  }
    if(request.url === "/index"){
        fs.readFile("index.html", function (err, data) {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(data, function(err) {response.end();});
            //response.end();
        });
    }
}

//node server
var server = http.createServer(function (request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  response.setHeader('Access-Control-Allow-Credentials', true);

  console.log('TopicList=' + JSON.stringify(topicList));
  console.log('TopicDetail=' + JSON.stringify(topicDetail));
  var requestBody = '';
  request.on('data', function (data) {
    requestBody += data;
  });
  request.on('end', function () {
    handleRequest(request, response, requestBody);
  });
});

//connect().use(serveStatic(index.html)).listen(8089, function(){
    //console.log('Server running on 8080...');
//});

server.listen(PORT, function () {
  console.log('Server running...');
    
});