const express = require('express');
const axios = require('axios');
const cors= require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 8000;
app.use(cors());
// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/cryptoData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to Mongoose');
}).catch((err) => {
    console.error(err);
});

const cryptoSchema = new mongoose.Schema({
  name: String,
  last: Number,
  buy: Number,
  sell: Number,
  volume: Number,
  base_unit: String,
});

const Crypto = mongoose.model('Crypto', cryptoSchema);

// Middleware to parse JSON requests
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Fetch data from the API and store it in MongoDB
try {
     fetchDataAndStoreInMongoDB();
    console.log('Data successfully fetched and stored.');
  } catch (error) {
    console.error('Error fetching or storing data:', error);
  }

async function fetchDataAndStoreInMongoDB() {
  try {
    // Fetch data from the API
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const cryptoData = response.data;

    // Extract the top 10 results
    const top10Crypto = Object.values(cryptoData).slice(0, 10);

    // Insert data into MongoDB using Mongoose
    await Crypto.insertMany(top10Crypto);
  } catch (error) {
    throw error;
  }
}

// Retrieve data from MongoDB using Mongoose
app.get('/getCryptoData', async (req, res) => {
  try {
    const cryptoData = await Crypto.find();
    res.json(cryptoData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving data from the database.');
  }
});
