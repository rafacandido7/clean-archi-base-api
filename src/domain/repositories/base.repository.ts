export interface BaseRepository<T, ID = string> {
  findById(id: ID): Promise<T | null>
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>
  update(id: ID, entity: Partial<T>): Promise<T | null>
  delete(id: ID): Promise<boolean>
}

export interface PaginationOptions {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}
