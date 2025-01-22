import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

// Fetch data from the UFC website to avoid CORS issues
app.get('/ufc-events', async (req, res) => {
    try {
        console.log("Fetching UFC data...");
        const response = await fetch('https://www.ufc.com/events', { 
            headers: { 'User-Agent': 'Mozilla/5.0' } 
        });
        
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        
        const html = await response.text();
        res.send(html);
    } catch (error) {
        console.error('Error fetching UFC events:', error.message);
        res.status(500).send('Failed to fetch UFC events');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy running at http://localhost:${PORT}`);
});
