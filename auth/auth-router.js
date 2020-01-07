const bcrypt = require('bcryptjs');
const router = require('express').Router();
const authModel = require('./auth-model');
// const authenticate = require('./authenticate-middleware')

router.post('/register', (req, res) => {
  let chef = req.body;
  const hash = bcrypt.hashSync(chef.password, 8);
  chef.password = hash;

  authModel.create(chef)
  .then(chef => {
    res.status(201).json(chef);
  })
  .catch(error => {
    res.status(500).json(error);
  });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  authModel.findBy({username}).first()
  .then(chef => {
    if (chef && bcrypt.compareSync(password, chef.password)) {
      const token = authModel.signToken(chef);
      res.json({id: chef.id, token: token})
    } else {
      res.status(401).json({msg: 'You shall not pass!'})
    }
  })
  .catch(err => res.status(500).json({msg: 'we have a problem'}));
});

module.exports = router;
