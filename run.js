#!/usr/bin/env node

require('dotenv').config()

const username = process.env.HTTP_USER
const password = process.env.HTTP_PASS
const users = {};
users[username] = password;

const express = require('express')
const app = express()
const path = require('path')
const basicAuth = require('express-basic-auth')
const cors = require('cors')

const exec = require('child_process').exec
const Gpio = require('onoff').Gpio

const button = new Gpio(4, 'in', 'rising', {debounceTimeout: 10})

function execute(command, callback){
  exec(command, function(error, stdout, stderr){ callback(stdout) })
}

function execute(command, callback){
 exec(command, function(error, stdout, stderr){ callback(stdout) })
}

//app.use(cors({origin: '*'}));
app.use(cors({origin: false}));
//app.use(cors());

/*app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();}
);*/

app.use(basicAuth({
  //users: { 'process.env.HTTP_USER': 'process.env.HTTP_PASS' },
  users,
  challenge: true,
  unauthorizedResponse: 'Unauthorized'
}))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/public/index.html'))
})

app.get('/poweroff', function (req, res) {
  console.log('poweroff')
  execute('sudo systemctl poweroff', function(callback){
    console.log(callback)
  })
  res.send('poweroff')
})

app.get('/reboot', function (req, res) {
  console.log('reboot')
  execute('sudo systemctl reboot', function(callback){
    console.log(callback)
  })
  res.send('reboot')
})
 
button.watch((err, value) => {
  if (err) {
    throw err
  }
  console.log('powerbutton shutdown')
  execute('sudo systemctl poweroff', function(callback){
    console.log(callback)
  })
})
 
process.on('SIGINT', _ => {
  button.unexport()
})

console.log('Listening...')
app.listen(1337)
