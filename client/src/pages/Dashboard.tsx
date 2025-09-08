import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  Bike,
  FileText,
  Calendar,
  Loader2
} from 'lucide-react';
import { Title } from '@/components/ui/Title';
import { Subtitle } from '@/components/ui/Subtitle';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/stores/auth';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { PaginatedResponse, User, Client, Motorcycle, Contract, ClientStatus, ContractStatus } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface DashboardStats {
  totalUsers: number;
  activeClients: number;
  totalMotorcycles: number;
  activeContracts: number;
  monthlyRevenue: number;
  pendingContracts: number;
  monthlyGoal: number;
}

interface RecentActivity {
  id: string;
  action: string;
  client?: string;
  motorcycle?: string;
  time: string;
  value?: string;
}

export default function Dashboard() {
  const { user } = useAuth();

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['dashboard-users'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<User>>('/users?limit=999&offset=0');
      return data;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ['dashboard-clients'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Client>>('/clients?limit=9999&offset=0');
      return data;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const { data: motorcyclesData, isLoading: motorcyclesLoading } = useQuery({
    queryKey: ['dashboard-motorcycles'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Motorcycle>>('/motorcycle?limit=9999&offset=0');
      return data;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const { data: contractsData, isLoading: contractsLoading } = useQuery({
    queryKey: ['dashboard-contracts'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Contract>>('/contract?limit=999&offset=0');
      return data;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const stats: DashboardStats = {
    totalUsers: usersData?.total || 0,
    activeClients: clientsData?.data?.filter(client => client.status === ClientStatus.ATIVO).length || 0,
    totalMotorcycles: motorcyclesData?.total || 0,
    activeContracts: contractsData?.data?.filter(contract => contract.status === ContractStatus.ATIVO).length || 0,
    monthlyRevenue: contractsData?.data?.filter(contract => {
      const contractDate = new Date(contract.data);
      const currentDate = new Date();
      return contractDate.getMonth() === currentDate.getMonth() &&
        contractDate.getFullYear() === currentDate.getFullYear() &&
        contract.status === ContractStatus.ATIVO;
    }).reduce((sum, contract) => sum + contract.valor, 0) || 0,
    pendingContracts: contractsData?.data?.filter(contract => contract.status === ContractStatus.ATIVO).length || 0,
    monthlyGoal: 15000000,
  };

  const recentActivities: RecentActivity[] = [
    ...(contractsData?.data?.slice(0, 2).map(contract => ({
      id: contract.id,
      action: 'Novo contrato criado',
      client: contract.client?.fullName,
      motorcycle: contract.motorcycle?.nome,
      time: new Date(contract.created_at).toLocaleDateString('pt-BR'),
      value: formatCurrency(contract.valor)
    })) || []),
    ...(clientsData?.data?.slice(0, 1).map(client => ({
      id: client.id,
      action: 'Cliente cadastrado',
      client: client.fullName,
      time: new Date(client.created_at).toLocaleDateString('pt-BR'),
    })) || []),
    ...(motorcyclesData?.data?.slice(0, 1).map(motorcycle => ({
      id: motorcycle.id,
      action: 'Motocicleta adicionada',
      motorcycle: motorcycle.nome,
      time: new Date(motorcycle.created_at).toLocaleDateString('pt-BR'),
      value: formatCurrency(motorcycle.valor_venda)
    })) || [])
  ].slice(0, 4);

  const isLoading = usersLoading || clientsLoading || motorcyclesLoading || contractsLoading;

  const statsData = [
    {
      title: 'Total de Usuários',
      value: stats.totalUsers.toString(),
      changeType: 'increase' as const,
      icon: Users,
      color: 'bg-primary',
      path: '/users'
    },
    {
      title: 'Clientes Ativos',
      value: stats.activeClients.toString(),
      changeType: 'increase' as const,
      icon: UserCheck,
      color: 'bg-secondary',
      path: '/clients'
    },
    {
      title: 'Motocicletas',
      value: stats.totalMotorcycles.toString(),
      changeType: 'increase' as const,
      icon: Bike,
      color: 'bg-accent',
      path: '/motorcycles'
    },
    {
      title: 'Contratos Ativos',
      value: stats.activeContracts.toString(),
      changeType: 'decrease' as const,
      icon: FileText,
      color: 'bg-warning',
      path: '/contracts'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <Title size="3xl" className="text-foreground">
          Dashboard
        </Title>
        <Subtitle className="text-muted-foreground">
          Bem-vindo de volta, {user?.name}! Aqui está o resumo do seu negócio hoje.
        </Subtitle>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={stat.path}>
              <div className="bg-card border border-border rounded-xl p-6 shadow-elegant hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-card-foreground mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="bg-card border border-border rounded-xl p-6 shadow-elegant">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Title size="lg" className="text-card-foreground">
                  Atividades Recentes
                </Title>
                <Subtitle className="text-muted-foreground">
                  Últimas movimentações do sistema
                </Subtitle>
              </div>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">
                        {activity.action}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.client && `Cliente: ${activity.client}`}
                        {activity.client && activity.motorcycle && ' • '}
                        {activity.motorcycle && `Moto: ${activity.motorcycle}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.value && (
                      <p className="font-semibold text-success">
                        {activity.value}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-card border border-border rounded-xl p-6 shadow-elegant">
            <Title size="lg" className="text-card-foreground mb-2">
              Ações Rápidas
            </Title>
            <Subtitle className="text-muted-foreground mb-6">
              Acesso rápido às principais funcionalidades
            </Subtitle>

            <div className="flex flex-col gap-4">
              <Link to="/clients/cadastrar">
                <Button testID="new-client" type="primary" className="w-full justify-start">
                  <UserCheck className="w-5 h-5 mr-3" />
                  Novo Cliente
                </Button>
              </Link>

              <Link to="/motorcycles/cadastrar">
                <Button testID="new-motorcycle" type="secondary" className="w-full justify-start">
                  <Bike className="w-5 h-5 mr-3" />
                  Nova Motocicleta
                </Button>
              </Link>

              <Link to="/contracts/cadastrar">
                <Button testID="new-contract" type="accent" className="w-full justify-start">
                  <FileText className="w-5 h-5 mr-3" />
                  Novo Contrato
                </Button>
              </Link>

              <Link to="/users/cadastrar">
                <Button testID="new-user" type="off" className="w-full justify-start">
                  <Users className="w-5 h-5 mr-3" />
                  Novo Usuário
                </Button>
              </Link>
            </div>

            {/* <div className="mt-6 pt-6 border-t border-border">
              <Title size="md" className="text-card-foreground mb-4">
                Resumo Financeiro
              </Title>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Receita Mensal</span>
                  <span className="font-semibold text-success">{formatCurrency(stats.monthlyRevenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Contratos Pendentes</span>
                  <span className="font-semibold text-warning">{stats.pendingContracts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Meta do Mês</span>
                  <span className="font-semibold text-primary">{formatCurrency(stats.monthlyGoal)}</span>
                </div>
              </div>

              <div className="mt-4 bg-muted rounded-full h-2">
                <div
                  className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((stats.monthlyRevenue / stats.monthlyGoal) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round((stats.monthlyRevenue / stats.monthlyGoal) * 100)}% da meta atingida
              </p>
            </div> */}
          </div>
        </motion.div>
      </div>
    </div>
  );
}