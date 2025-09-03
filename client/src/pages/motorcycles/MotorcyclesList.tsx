import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MotorcycleStatus, Motorcycle, PaginatedResponse } from '@/types';
import { Selectize } from '@/components/ui/Selectize';
import { Subtitle } from '@/components/ui/Subtitle';
import * as Popover from '@radix-ui/react-popover';
import { Button } from '@/components/ui/Button';
import { Title } from '@/components/ui/Title';
import { Input } from '@/components/ui/Input';

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import moment from 'moment';
import api from '@/lib/api';
import { 
  Bike, 
  Plus, 
  Search, 
  Trash2, 
  Eye,
  MoreVertical,
  Filter
} from 'lucide-react';

export default function MotorcyclesList() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<MotorcycleStatus | ''>('');
  const [anoMin, setAnoMin] = useState('');
  const [anoMax, setAnoMax] = useState('');
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [motorcycleToDelete, setMotorcycleToDelete] = useState<Motorcycle | null>(null);
  const queryClient = useQueryClient();
  
  const { data: motorcyclesData, isLoading } = useQuery({
    queryKey: [
      'get-motorcycles',
      page,
      search,
      status,
      anoMin,
      anoMax,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: String(10),
        offset: String((page - 1) * 10),
      });

      if (search) params.append('nome', search);
      if (status) params.append('status', status);
      if (anoMin && anoMin.length === 4) params.append('anoMin', anoMin);
      if (anoMax && anoMax.length === 4) params.append('anoMax', anoMax);

      const { data } = await api.get<PaginatedResponse<Motorcycle>>(`/motorcycle?${params.toString()}`);

      return data;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: deleteMotorcycle } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/motorcycle/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-motorcycles'] });
      toast.success('Motocicleta excluída com sucesso!');
      setShowDeleteModal(false);
      setMotorcycleToDelete(null);
    },
    onError: () => {
      toast.error('Erro ao excluir motocicleta');
    }
  });

  const handleDelete = (motorcycle: Motorcycle) => {
    setMotorcycleToDelete(motorcycle);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setMotorcycleToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (motorcycleToDelete) {
      deleteMotorcycle(motorcycleToDelete.id);
    }
  };

  const getStatusColor = (status: MotorcycleStatus) => {
    switch (status) {
      case MotorcycleStatus.ATIVO:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case MotorcycleStatus.INATIVO:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case MotorcycleStatus.VENDIDO:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <Title size="2xl" className="text-foreground flex items-center gap-3">
            <Bike className="w-8 h-8 text-primary" />
            Motocicletas
          </Title>
          <Subtitle className="text-muted-foreground">
            Gerencie o estoque de motocicletas
          </Subtitle>
        </div>
        
        <Link to="/motorcycles/cadastrar">
          <Button testID="new-motorcycle" type="primary" className="shadow-primary">
            <Plus className="w-5 h-5 mr-2" />
            Nova Motocicleta
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-6 shadow-elegant"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <Title size="sm" className="text-card-foreground">
            Filtros
          </Title>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            inputFieldProps={{
              testID: 'search-input',
              label: 'Buscar',
              input: {
                placeholder: 'Nome da motocicleta...',
                value: search,
                onChange: (e) => setSearch(e.target.value)
              }
            }}
            leftIcon={<Search className="w-5 h-5 text-muted-foreground" />}
          />
          
          <Selectize
            label="Status"
            allOptions={[
              { text: 'Todos os status', value: '' },
              { text: 'Ativo', value: MotorcycleStatus.ATIVO },
              { text: 'Inativo', value: MotorcycleStatus.INATIVO },
              { text: 'Vendido', value: MotorcycleStatus.VENDIDO }
            ]}
            selectedOptions={status ? [{ 
              text: status === MotorcycleStatus.ATIVO 
                ? 'Ativo' : status === MotorcycleStatus.INATIVO 
                ? 'Inativo' : 'Vendido', 
                value: status 
            }] : []}
            setSelectedOptions={(options) => setStatus(options.length > 0 ? options[0].value as MotorcycleStatus : '')}
            multiple={false}
            search={false}
            placeholder="Todos os status"
          />
          
          <Input
            inputFieldProps={{
              testID: 'ano-min-input',
              label: 'Ano Mínimo',
              input: {
                placeholder: '2017',
                value: anoMin,
                onChange: (e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setAnoMin(value);
                },
                maxLength: 4
              }
            }}
          />
          
          <Input
            inputFieldProps={{
              testID: 'ano-max-input',
              label: 'Ano Máximo',
              input: {
                placeholder: '2025',
                value: anoMax,
                onChange: (e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setAnoMax(value);
                },
                maxLength: 4
              }
            }}
          />
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
                  Motocicleta
                </th>
                <th className="text-left p-4 font-semibold text-card-foreground">
                  Placa
                </th>
                <th className="text-left p-4 font-semibold text-card-foreground">
                  Ano
                </th>
                <th className="text-left p-4 font-semibold text-card-foreground">
                  Valor Venda
                </th>
                <th className="text-left p-4 font-semibold text-card-foreground">
                  Status
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
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="h-8 w-8 bg-muted rounded animate-pulse ml-auto" />
                    </td>
                  </tr>
                ))
              ) : motorcyclesData.data?.length ? (
                motorcyclesData.data.map((motorcycle, index) => (
                  <motion.tr
                    key={motorcycle.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                          <Bike className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">
                            {motorcycle.nome}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {motorcycle.cor}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground font-mono">
                      {motorcycle.placa ? 
                        motorcycle.placa.replace(/([A-Za-z]{3})(\d{4})/, '$1-$2').toUpperCase() 
                        : '-'
                      }
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {moment(motorcycle.ano, 'YYYY').format('YYYY')}
                    </td>
                    <td className="p-4 text-card-foreground font-semibold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(motorcycle.valor_venda)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(motorcycle.status)}`}>
                        {motorcycle.status}
                      </span>
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
                              <Link to={`/motorcycles/${motorcycle.id}`}>
                                <button className="flex items-center gap-2 w-full p-2 text-left hover:bg-muted rounded transition-colors">
                                  <Eye className="w-4 h-4" />
                                  <span className="text-sm">Visualizar</span>
                                </button>
                              </Link>
                              
                              <button 
                                onClick={() => handleDelete(motorcycle)}
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
                  <td colSpan={6} className="p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Bike className="w-12 h-12 text-muted-foreground" />
                      <div>
                        <p className="text-card-foreground font-medium">
                          Nenhuma motocicleta encontrada
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {search || status || (anoMin && anoMin.length === 4) || (anoMax && anoMax.length === 4)
                            ? 'Tente ajustar os filtros de busca'
                            : 'Comece adicionando a primeira motocicleta'
                          }
                        </p>
                      </div>
                      <Link to="/motorcycles/cadastrar">
                        <Button testID="empty-state-new-motorcycle" type="primary">
                          <Plus className="w-4 h-4 mr-2" />
                          Nova Motocicleta
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {motorcyclesData && motorcyclesData.total > 0 && motorcyclesData.pages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Mostrando {((motorcyclesData.page - 1) * motorcyclesData.limit) + 1} até {Math.min(motorcyclesData.page * motorcyclesData.limit, motorcyclesData.total)} de {motorcyclesData.total} motocicletas
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                testID="prev-page"
                type="secondary"
                disabled={motorcyclesData.page === 1}
                onClick={() => setPage(motorcyclesData.page - 1)}
              >
                Anterior
              </Button>
              
              <span className="px-4 py-2 text-sm">
                {motorcyclesData.page} de {motorcyclesData.pages}
              </span>
              
              <Button
                testID="next-page"
                type="secondary"
                disabled={motorcyclesData.page === motorcyclesData.pages}
                onClick={() => setPage(motorcyclesData.page + 1)}
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
                  Excluir Motocicleta
                </h3>
                <p className="text-muted-foreground mt-2">
                  Tem certeza que deseja excluir a motocicleta <strong>{motorcycleToDelete?.nome}</strong>?
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