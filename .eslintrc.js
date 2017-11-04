module.exports = {
  "extends": "airbnb-base",
  "rules": {
    "no-underscore-dangle": ["error", {"allowAfterThis": true}]
  },
  "globals": {
    "log": true,
  },
  "env": {
    "browser": true,
  }
};