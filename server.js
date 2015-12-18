var express = require('express');
var fs = require('fs');
var d3 = require("d3");
var _  = require("lodash");
var app     = express();

var Signal = require('./model/Signal.js');

app.get('/', function(req, res){

    var s = Signal.CreateSignal(10,10, 'test');
    s.powerChange(10);
    console.log(s.print_signal()); //Prints to server console
    res.send(s)
});

app.listen('8081')
console.log('http://localhost:8081/');
exports = module.exports = app;
