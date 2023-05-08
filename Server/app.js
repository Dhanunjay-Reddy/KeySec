const express = require('express');
const mongoose = require('mongoose');
const PORT = 5000;
app = express();
const {MONGOURI} = require('./keys')
require('./models/user');
const cors = require('./middleware/cors')




mongoose.connect(MONGOURI, {
    useUnifiedtopology:true,
})

mongoose.connection.once('open',()=>{
    console.log("Connection established")
})
mongoose.connection.on('connection',(err)=>{
    console.log("Error connecting to Mongo:  ", err)
})

app.use(cors);
app.use(express.json());
app.use(require('./routes/auth'));





app.listen(PORT, (req, res) =>{
    console.log("listening on port", PORT);
})