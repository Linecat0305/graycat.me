import { PrismaClient } from '@prisma/client'

// 此設定防止在開發環境下 Prisma 客戶端過度實例化
// https://www.prisma.io/docs/guides/performance-and-optimization/connection-management

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// 為了處理 Vercel serverless 環境
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export default prisma