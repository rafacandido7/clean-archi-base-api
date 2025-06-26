import { beforeAll, afterAll, beforeEach } from 'vitest'
// import { MongoMemoryServer } from 'mongodb-memory-server'
// import { Connection } from 'mongoose'

// let mongod: MongoMemoryServer
// let mongoConnection: Connection

// Setup MongoDB Memory Server for E2E tests
beforeAll(async () => {
  // mongod = await MongoMemoryServer.create()
  // const uri = mongod.getUri()
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/test'
  process.env.NODE_ENV = 'test'
})

afterAll(async () => {
  // if (mongoConnection) {
  //   await mongoConnection.close()
  // }
  // if (mongod) {
  //   await mongod.stop()
  // }
})

// Clean database between tests
beforeEach(async () => {
  // if (mongoConnection) {
  //   const collections = mongoConnection.collections
  //   for (const key in collections) {
  //     const collection = collections[key]
  //     await collection.deleteMany({})
  //   }
  // }
})
