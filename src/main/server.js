const { app } = require('./app');

const port = 3000;

app.listen(port, () => {
    console.log(`CRCP 6340 (1257) WebApp listening at http://localhost:${port}`);
});
