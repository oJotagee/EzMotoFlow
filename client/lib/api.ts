import { useAuthStore } from '../store/userStore';
import axios, { AxiosResponse } from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:3000',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.request.use(
	(config) => {
		const token = useAuthStore.getState().token;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

api.interceptors.response.use(
	(response: AxiosResponse) => response,
	(error) => {
		if (error.response?.status === 401) {
			useAuthStore.getState().logout();
			window.location.href = '/login';
		}
		return Promise.reject(error);
	},
);

export { api };

export interface ApiResponse<T> {
	data: T;
	message?: string;
	success: boolean;
}

export interface PaginatedResponse<T> {
	data: T[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

export interface ApiError {
	message: string;
	statusCode: number;
	error: string;
}
