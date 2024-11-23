const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Schema
const icdSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true }
});

const ICD = mongoose.model('ICD', icdSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/icd_db')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/icd', async (req, res) => {
  try {
    const codes = await ICD.find();
    res.json(codes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/icd', async (req, res) => {
  try {
    const icd = new ICD(req.body);
    await icd.save();
    res.status(201).json(icd);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/icd/:code', async (req, res) => {
  try {
    await ICD.findOneAndDelete({ code: req.params.code });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/icd/validate/:code', async (req, res) => {
  try {
    const icd = await ICD.findOne({ code: req.params.code });
    res.json({ valid: !!icd });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});