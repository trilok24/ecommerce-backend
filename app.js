const express =require ("express");
const app = express();
const mongoose = require('mongoose');
const routes = require("./route");

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI 


app.use (express.json());


mongoose.connect('mongodb+srv://mandre:Root@cluster0.fo7e5.mongodb.net/',
 {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
app.use('/api',routes);  
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});