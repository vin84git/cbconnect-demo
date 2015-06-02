CBConnect-DEMO - Streaming Data from couchbase to kafka
==========================================================


Installing and Running
----

Install [Node.js](http://nodejs.org/).

Clone GitHub repo:

Install node module dependencies:

```
npm install 
```

Run application:

```
npm start
```

update config.js to use your kafka host and port

kafka: {
		host:'localhost',
		port:'2181',
  		cbtweet_topic: 'cbconnect',
  		partition:'0'
	}

Go to [http://localhost:5000](http://localhost:5000) in your browser.
