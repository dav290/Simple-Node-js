const express=require('express')
const app = express()
const mongoose=require('mongoose')
const route=require('./Route/route')
app.use(express.json())
app.use(route)
require('dotenv').config()
const path=require('path')
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
mongoose.connect(process.env.Mongo)
  .then(() =>{
    
    app.listen(3000,()=>{
        console.log('App listen on port 3000')
    })
    console.log('Connected to MongoDB')})
  .catch(err => console.error('Failed to connect to MongoDB', err));
