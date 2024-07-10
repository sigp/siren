import { LogType } from '../../src/types';
import fetchFromApi from '../../utilities/fetchFromApi';

const backendUrl = process.env.BACKEND_URL
export const fetchLogMetrics = async (token: string, type?: LogType) => fetchFromApi(`${backendUrl}/logs/metrics${type ? `/${type}` : ''}`, token)
export const dismissLogAlert = async (token: string, index: string) => fetchFromApi(`${backendUrl}/logs/dismiss/${index}`, token)
export const fetchPriorityLogs = async (token: string, page?: string) => fetchFromApi(`${backendUrl}/logs/priority${page ? `/${page}` : ''}`, token)