const express = require('express')
const app = express()

const PORT = process.env.PORT || 4040

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
