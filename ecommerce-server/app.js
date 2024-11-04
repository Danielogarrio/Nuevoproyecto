const express = require('express');
const { create } = require('express-handlebars');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const http = require('http');
const { Server } = require('socket.io');
const ProductManager = require('./models/ProductManager');

const app = express();
const server = http.createServer(app);
const io = new Server(server);


const hbs = create({
  extname: '.handlebars',
  defaultLayout: 'main',
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());
app.use(express.static('public'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const productManager = new ProductManager();

app.get('/home', async (req, res) => {
  const products = await productManager.getAllProducts();
  res.render('home', { products });
});


app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getAllProducts();
  res.render('realTimeProducts', { products });
});


io.on('connection', (socket) => {
  console.log('Cliente conectado');

  
  socket.emit('productList', productManager.getAllProducts());


  socket.on('createProduct', async (newProduct) => {
    await productManager.addProduct(newProduct);
    const updatedProducts = await productManager.getAllProducts();
    io.emit('productList', updatedProducts);
  });

  
  socket.on('deleteProduct', async (productId) => {
    await productManager.deleteProduct(productId);
    const updatedProducts = await productManager.getAllProducts();
    io.emit('productList', updatedProducts); 
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});