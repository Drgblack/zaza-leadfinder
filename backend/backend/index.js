const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Middleware
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

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
