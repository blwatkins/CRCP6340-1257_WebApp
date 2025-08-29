import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/mail', (request, response) => {
    console.log('mail request received');
    response.send('mail request received');
});

app.listen(port, () => {
    console.log(`CRCP 6340 (1257) WebApp listening at http://localhost:${port}`);
});
