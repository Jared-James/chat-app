const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000


// locates the public directory
const publicDirectoryPath = path.join(__dirname, '../public')

// Serve up the public directory
app.use(express.static(publicDirectoryPath))


app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})