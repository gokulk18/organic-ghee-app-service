const express =require('express')
const path = require('path')
const hbs=require('hbs')
const route=require('./routers/main')
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const session=require('express-session');
const fileUpload = require('express-fileupload');
const { handlebars } = require('hbs');
require("./handlebar")//this hbs user made handlebars
const app=express();
app.use(fileUpload())
app.use(session({
    secret:"restorent_datails"
}))
app.use(bodyParser.urlencoded({
    extended:true
}))

app.use('',route)
//static folder
app.use("/static",express.static(path.join(__dirname, '..', 'public')));
//template engine
app.set("view engine",'hbs')
app.set("views",path.join(__dirname, '..', 'views'))
//app.set("views","")
hbs.registerPartials(path.join(__dirname, '..', 'views', 'partials'))





// Connect Mongoose (used for other app features)
if (process.env.AZURE_COSMOS_CONNECTIONSTRING) {
    mongoose.connect(process.env.AZURE_COSMOS_CONNECTIONSTRING)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
    });
} else {
    console.log("AZURE_COSMOS_CONNECTIONSTRING not set. MongoDB/Mongoose features will not be connected.");
}

// Initialize Cosmos DB NoSQL Client
const { CosmosClient } = require("@azure/cosmos");
const cosmosEndpoint = process.env.COSMOS_ENDPOINT;
const cosmosKey = process.env.COSMOS_KEY;
const cosmosDatabaseId = process.env.COSMOS_DATABASE || "GheeAppDB";
const cosmosContainerId = process.env.COSMOS_CONTAINER || "users";

if (cosmosEndpoint && cosmosKey) {
    try {
        const cosmosClient = new CosmosClient({ endpoint: cosmosEndpoint, key: cosmosKey });
        const container = cosmosClient.database(cosmosDatabaseId).container(cosmosContainerId);
        app.locals.cosmosContainer = container;
        console.log("Cosmos DB NoSQL Client Initialized successfully.");
    } catch (err) {
        console.error("Error initializing Cosmos DB NoSQL client:", err.message);
    }
} else {
    console.log("Cosmos DB NoSQL credentials (COSMOS_ENDPOINT / COSMOS_KEY) not set.");
}

const PORT = process.env.PORT || 5656;

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});
