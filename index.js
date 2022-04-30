const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_Fruits}:${process.env.DB_PASS}@cluster0.g0slb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const fruitsCollection = client.db("fruits1").collection("products");

    app.get("/fruit", async (req, res) => {
      const query = {};
      const cursor = fruitsCollection.find(query);
      const fruits = await cursor.toArray();
      res.send(fruits);
    });

    app.get("/fruit/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const fruit = await fruitsCollection.findOne(query);
      res.send(fruit);
    });

    app.put("/fruit/:id", async (req, res) => {
      const id = req.params.id;
      const updateQuantity = req.body;
      console.log(updateQuantity);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: updateQuantity.newQuantity,
        },
      };
      const results = await fruitsCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(results);
    });
    app.delete("/fruit/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await fruitsCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("fruits server");
});

app.listen(port, () => {
  console.log("Ex port", port);
});
