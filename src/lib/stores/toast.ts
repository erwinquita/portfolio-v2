import { writable } from 'svelte/store';

export interface Toast {
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	message: string;
	duration?: number;
	dismissible?: boolean;
}

export interface ToastOptions {
	duration?: number;
	dismissible?: boolean;
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	function generateId(): string {
		return Math.random().toString(36).substring(2, 9);
	}

	function add(toast: Omit<Toast, 'id'>) {
		const id = generateId();
		const newToast: Toast = {
			id,
			duration: 5000,
			dismissible: true,
			...toast
		};

		update(toasts => [...toasts, newToast]);
		return id;
	}

	function remove(id: string) {
		update(toasts => toasts.filter(toast => toast.id !== id));
	}

	function clear() {
		update(() => []);
	}

	// Convenience methods for different toast types
	function success(message: string, options?: ToastOptions) {
		return add({ type: 'success', message, ...options });
	}

	function error(message: string, options?: ToastOptions) {
		return add({ type: 'error', message, ...options });
	}

	function warning(message: string, options?: ToastOptions) {
		return add({ type: 'warning', message, ...options });
	}

	function info(message: string, options?: ToastOptions) {
		return add({ type: 'info', message, ...options });
	}

	return {
		subscribe,
		add,
		remove,
		clear,
		success,
		error,
		warning,
		info
	};
}

export const toastStore = createToastStore();
