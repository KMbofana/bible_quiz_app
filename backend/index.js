const express = require('express');
const https = require('https')
const db = require('./connections/dbconnect');
const router = require('./routes/routes');
const bodyParser = express.urlencoded()
const cors = require('cors')
const usersController = require('./controllers/usersController')

// Load SSL certificate and key
// const options = {
//   key: fs.readFileSync(path.join(__dirname, "key.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "cert.pem"))
// };

const app = express();
const port = 3001;
db.connection()
usersController.createSuperUser()
app.use(cors())
app.use(bodyParser)
app.use(express.json());
app.use(router)

https.createServer(app.listen(port,()=>{
    console.log('hurray!! 🎉 app running on '+port)
}))