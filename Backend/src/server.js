import dotenv from 'dotenv'
import connectDB from './database/db.js';
import { app } from './app.js';
dotenv.config()

const PORT = process.env.PORT || 3000;

connectDB()

app.get('/', (req, res) => {
    res.send('PulsePing Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
});
