var express = require('express');
var path = require('path');
var index = require('./routes/index');
var tweets = require('./routes/tweets');
var kfkMsgs = require('./routes/kafkaMsgs');
var app = express();

// serve static assets from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// look for view html in the views directory
app.set('views', path.join(__dirname, 'views'));

// use ejs to render 
app.set('view engine', 'ejs');

// setup routes
app.use('/', index);
app.use('/tweets', tweets);
app.use('/msgs', kfkMsgs);

/** Kafka Consumer Start **/

var config = require('./config');
var kafka = require('kafka-node');

var Consumer = kafka.Consumer;
var Offset = kafka.Offset;
var Client = kafka.Client;
var topic =  'cbconnect';

var twts = [];
var client = new Client(config.kafka.host+":"+config.kafka.port);
var topics = [
        {topic: config.kafka.cbtweet_topic, partition: config.kafka.partition}
    ],
    options = { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024*1024 };

var consumer = new Consumer(client, topics, options);
var offset = new Offset(client);

consumer.on('message', function (message) {
    var ts = new Date().getTime();
    twts.push({t:ts,m:message.value});
    console.log(message);
});

consumer.on('error', function (err) {
    console.log('error', err);
});

/*
* If consumer get `offsetOutOfRange` event, fetch data from the smallest(oldest) offset
*/
consumer.on('offsetOutOfRange', function (topic) {
    topic.maxNum = 2;
    offset.fetch([topic], function (err, offsets) {
        var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
        consumer.setOffset(topic.topic, topic.partition, min);
    });
});


/** Kafka Consumer End **/


module.exports = app;
exports.kmsgs = twts;

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('Listening on ' + port);
});
