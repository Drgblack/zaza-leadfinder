const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('🚀 Zaza LeadFinder backend is running!');
});

// GET /leads
app.get('/leads', async (req, res) => {
  console.log('🟡 [GET] /leads called...');
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
    console.log('🟢 Leads fetched:', leads);
    res.json(leads);
  } catch (error) {
    console.error('🔴 Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads', details: error.message });
  }
});

// ✅ POST /upload – Add new leads
app.post('/upload', async (req, res) => {
  console.log('🟡 [POST] /upload called...');
  const leads = req.body;

  if (!Array.isArray(leads)) {
    return res.status(400).json({ error: 'Invalid data format. Expected an array.' });
  }

  try {
    const createdLeads = await prisma.lead.createMany({
      data: leads,
      skipDuplicates: true,
    });
    console.log('🟢 Leads uploaded:', createdLeads);
    res.status(201).json({ message: 'Leads uploaded successfully', count: createdLeads.count });
  } catch (error) {
    console.error('🔴 Error uploading leads:', error);
    res.status(500).json({ error: 'Failed to upload leads', details: error.message });
  }
});

// ✅ Start the server LAST
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
