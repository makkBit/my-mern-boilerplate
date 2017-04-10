const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const morgan = require('morgan');
const app = express();	//insance of express
const router = require('./router');
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:8000/auth');

// app setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*'}));

router(app);

// console.log(process.env.KATAPPA);

// server setup
const port = process.env.PORT || 3000;
app.listen( port, function(){
	console.log('app running on port: '+port);
});