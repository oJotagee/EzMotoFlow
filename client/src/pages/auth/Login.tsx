import { Input, PasswordInput } from '@/components/ui/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Subtitle } from '@/components/ui/Subtitle';
import { useLogin } from '@/services/auth.service';
import { Bike, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Title } from '@/components/ui/Title';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    login(data, {
      onSuccess: () => {
        toast.success('Login realizado com sucesso!');
        navigate('/dashboard');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Erro ao fazer login');
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-moto flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow"
          >
            <Bike className="w-10 h-10 text-white" />
          </motion.div>
          
          <Title size="3xl" className="text-foreground mb-2">
            EzMotoFlow
          </Title>
          <Subtitle className="text-muted-foreground">
            Sistema de Gestão de Motocicletas
          </Subtitle>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl shadow-elegant p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Title size="xl" className="text-card-foreground mb-2">
                Fazer Login
              </Title>
              <Subtitle className="text-muted-foreground">
                Entre com suas credenciais para acessar o sistema
              </Subtitle>
            </div>

            <Input
              inputFieldProps={{
                testID: 'email-input',
                label: 'Email',
                input: {
                  ...register('email'),
                  type: 'email',
                  placeholder: 'seu@email.com',
                }
              }}
              leftIcon={<Mail className="w-5 h-5 text-muted-foreground" />}
              errorMessage={errors.email?.message}
              required
            />

            <PasswordInput
              inputFieldProps={{
                testID: 'password-input',
                label: 'Senha',
                input: {
                  ...register('password'),
                  placeholder: 'Digite sua senha',
                }
              }}
              leftIcon={<Lock className="w-5 h-5 text-muted-foreground" />}
              errorMessage={errors.password?.message}
            />

            <Button
              testID="login-button"
              type="primary"
              loading={isPending}
              disabled={isPending}
              className="w-full h-12 shadow-primary"
            >
              {isPending ? 'Entrando...' : 'Entrar'}
            </Button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-muted/50 border border-border rounded-lg"
            >
              <Title size="xs" className="text-muted-foreground mb-2">
                Credenciais de Teste:
              </Title>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><strong>Email:</strong> admin@ezmotoflow.com</p>
                <p><strong>Senha:</strong> 123456</p>
              </div>
            </motion.div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <Subtitle size="sm" className="text-muted-foreground">
            © 2024 EzMotoFlow. Todos os direitos reservados.
          </Subtitle>
        </motion.div>
      </motion.div>
    </div>
  );
}