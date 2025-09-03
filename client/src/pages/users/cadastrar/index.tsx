"use client"

import { User, Save, ArrowLeft, Mail, Lock } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input, PasswordInput } from '@/components/ui/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Subtitle } from '@/components/ui/Subtitle';
import { Button } from '@/components/ui/Button';
import { Title } from '@/components/ui/Title';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '@/lib/api';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type UserForm = z.infer<typeof userSchema>;

export default function CreateUserPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data: UserForm) => save(data);

  const { mutate: save, isPending: sending } = useMutation({
    mutationFn: async (values: UserForm) => {
      await api.post('/users', {
        name: values.name,
        email: values.email,
        password: values.password,
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['get-users'] });
      toast.success('Usuário criado com sucesso!');
      navigate('/users');
    },
    onError() {
      toast.error('Erro ao criar usuário!');
    }
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link to="/users">
          <Button testID="back-button" type="secondary" justIcon>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        
        <div>
          <Title size="2xl" className="text-foreground flex items-center gap-3">
            <User className="w-8 h-8 text-primary" />
            Novo Usuário
          </Title>
          <Subtitle className="text-muted-foreground">
            Preencha os dados para criar um novo usuário
          </Subtitle>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-6 shadow-elegant"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <Title size="lg" className="text-card-foreground mb-4">
              Informações do Usuário
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                inputFieldProps={{
                  testID: 'name-input',
                  label: 'Nome',
                  input: {
                    ...register('name'),
                    placeholder: 'Digite o nome completo'
                  }
                }}
                leftIcon={<User className="w-5 h-5 text-muted-foreground" />}
                errorMessage={errors.name?.message}
                required
              />

              <Input
                inputFieldProps={{
                  testID: 'email-input',
                  label: 'Email',
                  input: {
                    ...register('email'),
                    type: 'email',
                    placeholder: 'usuario@exemplo.com'
                  }
                }}
                leftIcon={<Mail className="w-5 h-5 text-muted-foreground" />}
                errorMessage={errors.email?.message}
                required
              />
            </div>
          </div>

          <div>
            <Title size="lg" className="text-card-foreground mb-4">
              Senha
            </Title>
            <div className="grid grid-cols-1 gap-6">
              <PasswordInput
                inputFieldProps={{
                  testID: 'password-input',
                  label: 'Senha',
                  input: {
                    ...register('password'),
                    placeholder: 'Mínimo 6 caracteres'
                  }
                }}
                leftIcon={<Lock className="w-5 h-5 text-muted-foreground" />}
                errorMessage={errors.password?.message}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <Button
              testID="save-button"
              type="primary"
              loading={sending}
              disabled={sending}
              className="shadow-primary"
            >
              <Save className="w-5 h-5 mr-2" />
              Criar Usuário
            </Button>

            <Link to="/users">
              <Button testID="cancel-button" type="secondary">
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
