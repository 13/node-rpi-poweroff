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

const exec = require('child_process').exec
const Gpio = require('onoff').Gpio

const button = new Gpio(4, 'in', 'rising', {debounceTimeout: 10})

const os = require("os");
const hostname = os.hostname();

function execute(command, callback){
  exec(command, function(error, stdout, stderr){ callback(stdout) })
}

function execute(command, callback){
 exec(command, function(error, stdout, stderr){ callback(stdout) })
}

app.use(basicAuth({
  //users: { 'process.env.HTTP_USER': 'process.env.HTTP_PASS' },
  users,
  challenge: true,
  unauthorizedResponse: 'Unauthorized'
}))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/public/index.html'))
})

app.get('/test.html', function (req, res) {
  res.sendFile(path.join(__dirname+'/public/test.html'))
})

app.get('/hostname', function (req, res) {
  console.log('hostname')
  res.send(JSON.stringify({hostname: hostname}))
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
