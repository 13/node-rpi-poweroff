#!/usr/bin/env node

require('dotenv').config()

const username = process.env.HTTP_USER || 'admin'
const password = process.env.HTTP_PASS || 'password'
const port = process.env.HTTP_PORT || '1337'
const octoprint_ip = process.env.OCTOPRINT_SERVER
const octoprint_token = process.env.OCTOPRINT_TOKEN
const mqtt_ip = process.env.MQTT_SERVER
const shelly_device = process.env.SHELLY_DEVICE
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

app.get('/api', function (req, res) {
  console.log('api')
  res.json({ hostname: hostname, uptime: process.uptime(), octoprint_ip: octoprint_ip, octoprint_token: octoprint_token, mqtt_ip: mqtt_ip, shelly_device: shelly_device })  
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
app.listen(port)

