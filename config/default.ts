export const port: number = process.env.PORT
  ? parseInt(process.env.PORT)
  : 3002;
export const maxKeys: number = 5 || process.env.MAX_KEYS;
export const threshold: number = 0.8 || process.env.THRESHOLD;
export const NODE_ENV: string = "production" || process.env.NODE_ENV;
