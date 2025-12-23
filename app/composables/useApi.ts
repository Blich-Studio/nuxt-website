export function useApi() {
  return $fetch.create({
    baseURL: '/api/_proxy',
    credentials: 'include',
  })
}
