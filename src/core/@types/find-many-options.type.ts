import { ClientSession } from 'mongoose'

export interface FindManyOptions {
  skip?: number
  limit?: number
  session?: ClientSession | null
}
