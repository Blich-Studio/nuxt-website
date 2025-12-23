// Local mock auth removed — use the real API gateway via /api/_proxy
export default defineEventHandler(() => {
  throw createError({ statusCode: 404, statusMessage: 'Mock auth removed. Use the real API gateway via /api/_proxy.' })
})
