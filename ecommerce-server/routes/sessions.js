router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado' });
    }
    res.status(200).json(req.user);
  });