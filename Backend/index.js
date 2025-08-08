// Initialization
import app from './app.js';
import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

const port=3000;
//routes
app.get('/', (_req,res)=>{
    res.send("This is homepage.");
});

// Starting the server port
app.listen(port,() =>{
    console.log(`Server started at PORT : ${port}`);
});


const uri = "mongodb+srv://gurungsochina:test123@cluster0.s0gv8dt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect( uri,  clientOptions);
  
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);

