const UserDTO = require('../dtos/UserDTO');

router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'No autorizado' });

  const userDTO = new UserDTO(req.user);
  res.status(200).json(userDTO);
});
const authorization = require('../middlewares/auth');

router.post('/products', authorization(['admin']), createProduct);
router.put('/products/:pid', authorization(['admin']), updateProduct);
router.delete('/products/:pid', authorization(['admin']), deleteProduct);

router.post('/carts/:cid/product/:pid', authorization(['user']), addProductToCart);