var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'checklist'
    },
    port: 3000,
    db: 'mongodb://localhost/checklist-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'checklist'
    },
    port: 3000,
    db: 'mongodb://localhost/checklist-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'checklist'
    },
    port: 3000,
    db: 'mongodb://localhost/checklist-production'
  }
};

module.exports = config[env];
