const express = require('express')
const bodyParser = require('body-parser')
const pino = require('express-pino-logger')()
const client = require('twilio')(
  process.env.TWILIO_SID, 
  process.env.TWILIO_AUTH_TOKEN
)

const port = process.env.PORT || 5000
const app = express()
const path = require('path')

app.use(express.static(path.join(__dirname, 'client/build')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(pino)

app.post('/api/messages', (req, res) => {
  res.header('Content-Type', 'application/json')
  client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER, 
    to: req.body.to, 
    body: req.body.message
  })
  .then(() => {
    res.send(JSON.stringify({ success: true }))
  })
  .catch(err => {
    console.log(err)
    res.send(JSON.stringify({ success: false }))
  })
})

app.get('*', (req, res) => {
  res.send(JSON.stringify({ message: "success!"}))
})

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname+'/client/build/index.html'))
// })

app.listen(port, () =>
  console.log(`Now listening on http://localhost:${port}`)
);