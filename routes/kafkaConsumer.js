var express = require('express');
var express = require('express');
var router = express.Router();
var config = require('../config');
var kafka = require('kafka-node');

var Consumer = kafka.Consumer;
var Offset = kafka.Offset;
var Client = kafka.Client;
var argv = require('optimist').argv;
var topic = argv.topic || 'cbconnect';

var tweets = [];
var client = new Client(config.kafka.host+":"+config.kafka.port);
var topics = [
        {topic: config.kafka.cbtweet_topic, partition: config.kafka.partition}
    ],
    options = { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024*1024 };

var consumer = new Consumer(client, topics, options);
var offset = new Offset(client);

consumer.on('message', function (message) {
    var ts = new Date().getTime();
    tweets.push({t:ts;m:message});
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


module.exports = tweets;
