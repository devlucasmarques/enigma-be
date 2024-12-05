require('dotenv-safe').config();
const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token)
    return res.status(401).json({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .json({ auth: false, message: 'Failed to authenticate token.' });

    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    req.level = decoded.level;
    req.name = decoded.name;
    req.email = decoded.email;

    next();
  });
};

module.exports = { verifyJWT };
