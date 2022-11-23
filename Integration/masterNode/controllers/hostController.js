const Host = require('../models/hostModel');
const factory = require('./handlerFactory');

exports.getAllHosts = factory.getAll(Host);
exports.getHost = factory.getOne(Host);
exports.createHost = factory.createOne(Host);
exports.updateHost = factory.updateOne(Host);
exports.deleteHost = factory.deleteOne(Host);
