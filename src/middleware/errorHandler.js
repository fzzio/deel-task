function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation error' });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'Unique constraint violation' });
  }

  return res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = errorHandler;
