import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type UserProps = {
	id?: number;
	nome?: string;
	email?: string;
	expiration?: string;
	token?: string;
};

interface UseUserProps {
	user: UserProps;
	setUser: (e: UserProps) => void;
	clearUser: () => void;
}

const useStore = create<UseUserProps>()(
	persist(
		(set) => ({
			user: {
				usuarioId: 0,
				usuarioNome: '',
				usuarioEmail: '',
				expiration: '',
				token: '',
			},
			setUser: (e) =>
				set({
					user: {
						...e,
					},
				}),
			clearUser: () =>
				set({
					user: {
						id: 0,
						nome: '',
						email: '',
						expiration: '',
						token: '',
					},
				}),
		}),
		{
			name: 'user-storage',
			storage: createJSONStorage(() => localStorage),
		},
	),
);

export const useUser = useStore;
