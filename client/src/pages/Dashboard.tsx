import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  Bike, 
  FileText, 
  TrendingUp,
  DollarSign,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Title } from '@/components/ui/Title';
import { Subtitle } from '@/components/ui/Subtitle';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/stores/auth';
import { Link } from 'react-router-dom';

const statsData = [
  {
    title: 'Total de Usuários',
    value: '24',
    change: '+12%',
    changeType: 'increase' as const,
    icon: Users,
    color: 'bg-primary',
    path: '/users'
  },
  {
    title: 'Clientes Ativos',
    value: '145',
    change: '+8%',
    changeType: 'increase' as const,
    icon: UserCheck,
    color: 'bg-secondary',
    path: '/clients'
  },
  {
    title: 'Motocicletas',
    value: '89',
    change: '+15%',
    changeType: 'increase' as const,
    icon: Bike,
    color: 'bg-accent',
    path: '/motorcycles'
  },
  {
    title: 'Contratos Ativos',
    value: '67',
    change: '-3%',
    changeType: 'decrease' as const,
    icon: FileText,
    color: 'bg-warning',
    path: '/contracts'
  }
];

const recentActivities = [
  {
    id: 1,
    action: 'Novo contrato criado',
    client: 'João Silva',
    motorcycle: 'Honda CB600F',
    time: 'há 2 horas',
    value: 'R$ 25.000,00'
  },
  {
    id: 2,
    action: 'Cliente cadastrado',
    client: 'Maria Santos',
    motorcycle: null,
    time: 'há 4 horas',
    value: null
  },
  {
    id: 3,
    action: 'Motocicleta adicionada',
    client: null,
    motorcycle: 'Yamaha MT-03',
    time: 'há 6 horas',
    value: 'R$ 18.500,00'
  },
  {
    id: 4,
    action: 'Contrato finalizado',
    client: 'Carlos Oliveira',
    motorcycle: 'Kawasaki Ninja 400',
    time: 'há 1 dia',
    value: 'R$ 22.000,00'
  }
];

export default function Dashboard() {
  const { user } = useAuth();

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
                    <div className="flex items-center mt-2 gap-1">
                      <TrendingUp className={`w-4 h-4 ${
                        stat.changeType === 'increase' ? 'text-success' : 'text-destructive'
                      }`} />
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'increase' ? 'text-success' : 'text-destructive'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        vs mês anterior
                      </span>
                    </div>
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
              <Button testID="view-all" type="secondary" className="text-sm">
                Ver todas
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
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

            <div className="space-y-3">
              <Link to="/clients/new">
                <Button testID="new-client" type="primary" className="w-full justify-start">
                  <UserCheck className="w-5 h-5 mr-3" />
                  Novo Cliente
                </Button>
              </Link>

              <Link to="/motorcycles/new">
                <Button testID="new-motorcycle" type="secondary" className="w-full justify-start">
                  <Bike className="w-5 h-5 mr-3" />
                  Nova Motocicleta
                </Button>
              </Link>

              <Link to="/contracts/new">
                <Button testID="new-contract" type="accent" className="w-full justify-start">
                  <FileText className="w-5 h-5 mr-3" />
                  Novo Contrato
                </Button>
              </Link>

              <Link to="/users/new">
                <Button testID="new-user" type="off" className="w-full justify-start">
                  <Users className="w-5 h-5 mr-3" />
                  Novo Usuário
                </Button>
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <Title size="md" className="text-card-foreground mb-4">
                Resumo Financeiro
              </Title>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Receita Mensal</span>
                  <span className="font-semibold text-success">R$ 125.450,00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Contratos Pendentes</span>
                  <span className="font-semibold text-warning">R$ 45.200,00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Meta do Mês</span>
                  <span className="font-semibold text-primary">R$ 150.000,00</span>
                </div>
              </div>

              <div className="mt-4 bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: '83%' }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                83% da meta atingida
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}