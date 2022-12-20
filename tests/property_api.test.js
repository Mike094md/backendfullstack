const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Property = require('../models/property')

beforeEach(async () => {
  await Property.deleteMany({})

  const propertiesObjects = helper.initialProperties
    .map(property => new Property(property))
  const promiseArray = propertiesObjects.map(property => property.save())
  await Promise.all(promiseArray)
})

describe('When there is initially some properties saved', () => {
  test('properties are returned as json', async () => {
    await api
      .get('/api/properties')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all properties are returned', async () => {
    const response = await api.get('/api/properties')

    expect(response.body).toHaveLength(helper.initialProperties.length)
  })

  test('a specific property is within the returned properties', async () => {
    const response = await api.get('/api/properties')

    const descriptions = response.body.map(r => r.description)

    expect(descriptions).toContain('Piso en majadahonda con ascensor, calefacción y aire acondicionado')
  })
})



afterAll(() => {
  mongoose.connection.close()
})