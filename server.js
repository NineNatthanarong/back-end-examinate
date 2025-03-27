const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'i-hope-i-will-pass-this-test';

const users = [
    { username: 'admin', password: 'passwordnakub' }
];

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/seed_db';
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db();
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

async function importCSV(db) {
    const collection = db.collection('seeds');
    
    await collection.deleteMany({});

    const results = [];
    
    return new Promise((resolve, reject) => {
        fs.createReadStream('seeds.csv')
            .pipe(csv({
                headers: ['_id', 'Seed_RepDate', 'Seed_Year', 'Seeds_YearWeek', 'Seed_Varity', 'Seed_RDCSD', 'Seed_Stock2Sale', 'Seed_Season', 'Seed_Crop_Year'],
                skipLines: 1
            }))
            .on('data', (data) => {
                const cleanedData = {
                    _id: parseInt(data._id) || null,
                    Seed_RepDate: parseInt(data.Seed_RepDate) || null,
                    Seed_Year: parseInt(data.Seed_Year) || null,
                    Seeds_YearWeek: parseInt(data.Seeds_YearWeek) || null,
                    Seed_Varity: data.Seed_Varity || null,
                    Seed_RDCSD: data.Seed_RDCSD || null,
                    Seed_Stock2Sale: parseInt(data.Seed_Stock2Sale.replace(/,/g, '')) || 0,
                    Seed_Season: data.Seed_Season || null,
                    Seed_Crop_Year: data.Seed_Crop_Year || null
                };
                results.push(cleanedData);
            })
            .on('end', async () => {
                try {
                    if (results.length > 0) {
                        await collection.insertMany(results);
                        console.log(`${results.length} documents inserted`);
                    }
                    resolve();
                } catch (error) {
                    console.error('Error inserting data:', error);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('CSV parsing error:', error);
                reject(error);
            });
    });
}


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token.' });
        req.user = user;
        next();
    });
};


async function startServer() {
    const db = await connectToDatabase();
    const collection = db.collection('seeds');
    
    try {
        await importCSV(db);
    } catch (error) {
        console.error('Failed to import CSV:', error);
    }

    
    app.post('/api/login', (req, res) => {
        const { username, password } = req.body;
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });

    
    app.get('/api/seeds', authenticateToken, async (req, res) => {
        try {
            const seeds = await collection.find().toArray();
            res.json(seeds);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch seeds', details: error.message });
        }
    });

    
    app.get('/api/seeds/:id', authenticateToken, async (req, res) => {
        try {
            const seed = await collection.findOne({ _id: parseInt(req.params.id) });
            if (!seed) return res.status(404).json({ error: 'Seed not found' });
            res.json(seed);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch seed', details: error.message });
        }
    });

    
    app.post('/api/seeds', authenticateToken, async (req, res) => {
        try {
            const newSeed = req.body;
            const result = await collection.insertOne(newSeed);
            res.status(201).json({ message: 'Seed added', id: result.insertedId });
        } catch (error) {
            res.status(500).json({ error: 'Failed to add seed', details: error.message });
        }
    });

    
    app.put('/api/seeds/:id', authenticateToken, async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const updatedSeed = req.body;
            const result = await collection.updateOne({ _id: id }, { $set: updatedSeed });
            if (result.matchedCount === 0) return res.status(404).json({ error: 'Seed not found' });
            res.json({ message: 'Seed updated' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update seed', details: error.message });
        }
    });

    
    app.delete('/api/seeds/:id', authenticateToken, async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const result = await collection.deleteOne({ _id: id });
            if (result.deletedCount === 0) return res.status(404).json({ error: 'Seed not found' });
            res.json({ message: 'Seed deleted' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete seed', details: error.message });
        }
    });

    
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    
    app.get('/health', (req, res) => {
        res.json({ status: 'healthy' });
    });

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
    });

    process.on('SIGTERM', async () => {
        await client.close();
        process.exit(0);
    });
}

startServer().catch(console.error);