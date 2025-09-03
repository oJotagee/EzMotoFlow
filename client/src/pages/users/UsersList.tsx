import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Subtitle } from '@/components/ui/Subtitle';
import * as Popover from '@radix-ui/react-popover';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Title } from '@/components/ui/Title';
import { formatDate } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { User, PaginatedResponse } from '@/types';
import { toast } from 'sonner';
import api from '@/lib/api';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MoreVertical
} from 'lucide-react';

export default function UsersList() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const queryClient = useQueryClient();
  
  const { data: usersResponse, isLoading } = useQuery({
    queryKey: [
      'get-users',
      page,
      10,
      search,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: String(10),
        offset: String((page - 1) * 10),
      });

      if (search) params.append('nomeUser', search);

      const { data } = await api.get<PaginatedResponse<User>>(`/users?${params.toString()}`);

      queryClient.setQueryData(['GetUsersListing'], {
        page: data.page,
        limit: data.limit,
        count: data.total,
        search,
      });

      return data;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: deleteUser } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-users'] });
      toast.success('Usuário excluído com sucesso!');
      setShowDeleteModal(false);
      setUserToDelete(null);
    },
    onError: () => {
      toast.error('Erro ao excluir usuário');
    }
  });

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
    }
  };

  const usersData = usersResponse?.data || [];
  const total = usersResponse?.total || 0;
  const pages = usersResponse?.pages || 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <Title size="2xl" className="text-foreground flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Usuários
          </Title>
          <Subtitle className="text-muted-foreground">
            Gerencie os usuários do sistema
          </Subtitle>
        </div>
        
        <Link to="/users/cadastrar">
          <Button testID="new-user" type="primary" className="shadow-primary">
            <Plus className="w-5 h-5 mr-2" />
            Novo Usuário
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-6 shadow-elegant"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              inputFieldProps={{
                testID: 'search-input',
                label: 'Buscar usuários',
                input: {
                  placeholder: 'Digite o nome...',
                  value: search,
                  onChange: (e) => setSearch(e.target.value)
                }
              }}
              leftIcon={<Search className="w-5 h-5 text-muted-foreground" />}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl shadow-elegant overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 font-semibold text-card-foreground">
                  Nome
                </th>
                <th className="text-left p-4 font-semibold text-card-foreground">
                  Email
                </th>
                <th className="text-left p-4 font-semibold text-card-foreground">
                  Criado em
                </th>
                <th className="text-right p-4 font-semibold text-card-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="p-4">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="h-8 w-8 bg-muted rounded animate-pulse ml-auto" />
                    </td>
                  </tr>
                ))
              ) : usersData?.length ? (
                usersData.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">
                            {user.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end">
                        <Popover.Root>
                          <Popover.Trigger asChild>
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </Popover.Trigger>
                          
                          <Popover.Portal>
                            <Popover.Content 
                              className="bg-background border border-border rounded-lg shadow-lg p-2 w-48 z-50"
                              sideOffset={5}
                              align="end"
                            >
                              <Link to={`/users/${user.id}`}>
                                <button className="flex items-center gap-2 w-full p-2 text-left hover:bg-muted rounded transition-colors">
                                  <Edit className="w-4 h-4" />
                                  <span className="text-sm">Editar</span>
                                </button>
                              </Link>
                              
                              <button 
                                onClick={() => handleDelete(user)}
                                className="flex items-center gap-2 w-full p-2 text-left hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="text-sm">Excluir</span>
                              </button>
                            </Popover.Content>
                          </Popover.Portal>
                        </Popover.Root>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Users className="w-12 h-12 text-muted-foreground" />
                      <div>
                        <p className="text-card-foreground font-medium">
                          Nenhum usuário encontrado
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {search 
                            ? 'Tente ajustar os filtros de busca'
                            : 'Comece adicionando o primeiro usuário'
                          }
                        </p>
                      </div>
                      <Link to="/users/cadastrar">
                        <Button testID="empty-state-new-user" type="primary">
                          <Plus className="w-4 h-4 mr-2" />
                          Novo Usuário
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {total > 0 && pages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Mostrando {((page - 1) * 10) + 1} até {Math.min(page * 10, total)} de {total} usuários
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                testID="prev-page"
                type="secondary"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </Button>
              
              <span className="px-4 py-2 text-sm">
                {page} de {pages}
              </span>
              
              <Button
                testID="next-page"
                type="secondary"
                disabled={page === pages}
                onClick={() => setPage(page + 1)}
              >
                Próximo
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-8 h-8 text-destructive" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Excluir Usuário
                </h3>
                <p className="text-muted-foreground mt-2">
                  Tem certeza que deseja excluir o usuário <strong>{userToDelete?.name}</strong>?
                  Esta ação não pode ser desfeita.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  testID="cancel-delete"
                  type="secondary"
                  onClick={handleCancelDelete}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  testID="confirm-delete"
                  type="primary"
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-destructive hover:bg-destructive/90"
                >
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}