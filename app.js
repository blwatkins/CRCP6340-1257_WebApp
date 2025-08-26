import express from 'express';

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (request, response) => {
    response.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Hello World app listening at http://localhost:${port}`);
});
