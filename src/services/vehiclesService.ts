import apiClient from './apiService.ts';

export async function getVehicles(q = '', page = 1, perPage = 10, orderBy = '', direction = 'ASC') {
  const ordered = orderBy ? `&$order=${orderBy} ${direction}` : '';
  return apiClient.get(`?$q=${q}&$limit=${perPage}&$offset=${page - 1}${ordered}`);
}

export async function getVehicle(id: string) {
  return apiClient.get(`?kenteken=${id}`);
}
