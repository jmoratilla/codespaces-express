const express = require('express')
const app = express()
const port = 3000
const path = require('path');

let publicPath = path.join(__dirname, 'public');

app.get('/', (req, res) => {
  res.sendFile(`${publicPath}/index.html`);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
