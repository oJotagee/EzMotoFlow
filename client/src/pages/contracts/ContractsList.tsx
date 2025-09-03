import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ContractStatus, PaymentMethod, Contract } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
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
import api from '@/lib/api';
import { 
  FileText, 
  Plus, 
  Search,
  Trash2, 
  Eye,
  MoreVertical,
  Filter,
  Download
} from 'lucide-react';

export default function ContractsList() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ContractStatus | ''>('');
  const [pagamento, setPagamento] = useState<PaymentMethod | ''>('');
  const [anoMin, setAnoMin] = useState('');
  const [anoMax, setAnoMax] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const queryClient = useQueryClient();
  
  const { data: contractsData, isLoading } = useQuery({
    queryKey: [
      'get-contracts',
      10,
      search,
      status,
      pagamento,
      anoMin,
      anoMax,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: String(10),
        offset: String((page - 1) * 10),
      });

      if (search) params.append('nomeCliente', search);
      if (status) params.append('status', status);
      if (pagamento) params.append('pagamento', pagamento);
      if (anoMin) params.append('dataInicio', anoMin);
      if (anoMax) params.append('dataFim', anoMax);

      const { data } = await api.get<Contract[]>(`/contract?${params.toString()}`);

      const total = data.length;
      
      queryClient.setQueryData(['GetContractsListing'], {
        page,
        limit: 10,
        count: total,
        search,
        status,
        pagamento,
        anoMin,
        anoMax,
      });

      setCount(total);
      return data;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: deleteContract } = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/contracts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-contracts'] });
      toast.success('Contrato excluído com sucesso!');
      setShowDeleteModal(false);
      setContractToDelete(null);
    },
    onError: () => {
      toast.error('Erro ao excluir contrato');
    }
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null);

  const handleDeleteClick = (contract: Contract) => {
    setContractToDelete(contract);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (contractToDelete) {
      deleteContract(contractToDelete.id);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setContractToDelete(null);
  };

  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.ATIVO:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case ContractStatus.CANCELADO:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case ContractStatus.FINALIZADO:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPaymentColor = (payment: PaymentMethod) => {
    switch (payment) {
      case PaymentMethod.PIX:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case PaymentMethod.CARTAO:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case PaymentMethod.BOLETO:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
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
            <FileText className="w-8 h-8 text-primary" />
            Contratos
          </Title>
          <Subtitle className="text-muted-foreground">
            Gerencie os contratos de venda
          </Subtitle>
        </div>
        
        <Link to="/contracts/cadastrar">
          <Button testID="new-contract" type="primary" className="shadow-primary">
            <Plus className="w-5 h-5 mr-2" />
            Novo Contrato
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            inputFieldProps={{
              testID: 'search-input',
              label: 'Buscar',
              input: {
                placeholder: 'Nome do cliente...',
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
              { text: 'Ativo', value: ContractStatus.ATIVO },
              { text: 'Cancelado', value: ContractStatus.CANCELADO },
              { text: 'Finalizado', value: ContractStatus.FINALIZADO }
            ]}
            selectedOptions={status ? [
              { 
                text: status === ContractStatus.ATIVO ? 'Ativo' : 
                status === ContractStatus.CANCELADO ? 'Cancelado' : 'Finalizado',
                value: status 
              }
            ] : []}
            setSelectedOptions={(options) => setStatus(options.length > 0 ? options[0].value as ContractStatus : '')}
            multiple={false}
            search={false}
            placeholder="Todos os status"
          />
          
          <Selectize
            label="Pagamento"
            allOptions={[
              { text: 'Todas as formas', value: '' },
              { text: 'PIX', value: PaymentMethod.PIX },
              { text: 'Cartão', value: PaymentMethod.CARTAO },
              { text: 'Boleto', value: PaymentMethod.BOLETO }
            ]}
            selectedOptions={pagamento ? [
              { 
                text: pagamento === PaymentMethod.PIX ? 'PIX' : 
                pagamento === PaymentMethod.CARTAO ? 'Cartão' : 'Boleto',
                value: pagamento 
              }
            ] : []}
            setSelectedOptions={(options) => setPagamento(options.length > 0 ? options[0].value as PaymentMethod : '')}
            multiple={false}
            search={false}
            placeholder="Todas as formas"
          />
          
          <Input
            inputFieldProps={{
              testID: 'data-inicio-input',
              label: 'Data Início',
              input: {
                type: 'date',
                value: anoMin,
                onChange: (e) => setAnoMin(e.target.value)
              }
            }}
          />
          
          <Input
            inputFieldProps={{
              testID: 'data-fim-input',
              label: 'Data Fim',
              input: {
                type: 'date',
                value: anoMax,
                onChange: (e) => setAnoMax(e.target.value)
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
                  Cliente / Motocicleta
                </th>
                <th className="text-left p-4 font-semibold text-card-foreground">
                  Valor
                </th>
                <th className="text-left p-4 font-semibold text-card-foreground">
                  Data
                </th>
                <th className="text-left p-4 font-semibold text-card-foreground">
                  Pagamento
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
                      <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="h-8 w-8 bg-muted rounded animate-pulse ml-auto" />
                    </td>
                  </tr>
                ))
              ) : contractsData?.length ? (
                contractsData.map((contract, index) => (
                  <motion.tr
                    key={contract.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">
                            {contract.client?.fullName || 'Cliente não encontrado'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {contract.motorcycle?.nome || 'Moto não encontrada'} - {contract.motorcycle?.placa}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-card-foreground font-semibold">
                      {formatCurrency(contract.valor)}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {formatDate(contract.data)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(contract.pagamento)}`}>
                        {contract.pagamento.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                        {contract.status}
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
                              <Link to={`/contracts/${contract.id}`}>
                                <button className="flex items-center gap-2 w-full p-2 text-left hover:bg-muted rounded transition-colors">
                                  <Eye className="w-4 h-4" />
                                  <span className="text-sm">Visualizar</span>
                                </button>
                              </Link>
                              
                              {contract.contractoPdf && (
                                <a 
                                  href={contract.contractoPdf} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 w-full p-2 text-left hover:bg-muted rounded transition-colors"
                                >
                                  <Download className="w-4 h-4" />
                                  <span className="text-sm">Baixar PDF</span>
                                </a>
                              )}
                              
                              <button 
                                onClick={() => handleDeleteClick(contract)}
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
                      <FileText className="w-12 h-12 text-muted-foreground" />
                      <div>
                        <p className="text-card-foreground font-medium">
                          Nenhum contrato encontrado
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {search || status || pagamento || anoMin || anoMax
                            ? 'Tente ajustar os filtros de busca'
                            : 'Comece criando o primeiro contrato'
                          }
                        </p>
                      </div>
                      <Link to="/contracts/cadastrar">
                        <Button testID="empty-state-new-contract" type="primary">
                          <Plus className="w-4 h-4 mr-2" />
                          Novo Contrato
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {count > 0 && Math.ceil(count / 10) > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Mostrando {((page - 1) * 10) + 1} até {Math.min(page * 10, count)} de {count} contratos
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
                {page} de {Math.ceil(count / 10)}
              </span>
              
              <Button
                testID="next-page"
                type="secondary"
                disabled={page === Math.ceil(count / 10)}
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
                  Excluir Contrato
                </h3>
                <p className="text-muted-foreground mt-2">
                  Tem certeza que deseja excluir o contrato do cliente <strong>{contractToDelete?.client?.fullName || 'Cliente'}</strong>?
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