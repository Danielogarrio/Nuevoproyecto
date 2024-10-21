const express = require('express');
const app = express();
const productRouter = require('./routers/products');
const cartRouter = require('./routers/carts');

app.use(express.json());  


app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);


const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}`);
});