const bodyParser = require('body-parser');
const express = require('express');
const mapRoutes = require('express-routes-mapper');
const { graphqlExpress } = require('apollo-server-express');

const config = require('../../config/');
const database = require('../../config/database');
const auth = require('../../api/policies/auth.policy');
const Schema = require('../../api/controllers/index');

process.env.NODE_ENV = 'testing';

const beforeAction = async () => {
  const testapp = express();
  const mappedOpenRoutes = mapRoutes(config.publicRoutes, 'api/controllers/');

  testapp.use(bodyParser.urlencoded({ extended: false }));
  testapp.use(bodyParser.json());

  // public REST API
  testapp.use('/rest', mappedOpenRoutes);

  // private GraphQL API
  testapp.all('/graphql', (req, res, next) => auth(req, res, next));
  testapp.get('/graphql', graphqlExpress({
    schema: Schema,
    pretty: true,
    graphiql: false,
  }));
  testapp.post('/graphql', graphqlExpress({
    schema: Schema,
    pretty: true,
    graphiql: false,
  }));

  await database.authenticate();
  await database.drop();
  await database.sync().then(() => console.log('Connection to the database has been established successfully'));

  return testapp;
};

const afterAction = async () => {
  await database.close();
};


module.exports = {
  beforeAction,
  afterAction,
};
