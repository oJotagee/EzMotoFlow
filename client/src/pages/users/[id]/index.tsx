"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Save, ArrowLeft, Mail, Lock, AlertTriangle } from 'lucide-react';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { PermissionResource, PermissionAction, UserPermissionsResponse } from '@/types/permissions';
import { PermissionsSelector } from '@/components/ui/PermissionsSelector';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Input, PasswordInput } from '@/components/ui/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Subtitle } from '@/components/ui/Subtitle';
import { Button } from '@/components/ui/Button';
import { Title } from '@/components/ui/Title';
import { User as UserType } from '@/types';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { z } from 'zod';
import { getErrorMessage } from '@/lib/error-messages';

const userSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().optional().or(z.literal('')).refine(
    (val) => !val || val.length >= 6,
    { message: 'Senha deve ter pelo menos 6 caracteres' }
  ),
});

type UserForm = z.infer<typeof userSchema>;

interface Permission {
  resource: PermissionResource;
  action: PermissionAction;
}

export default function EditUserPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data: UserForm) => {
    update(data);
  };

  const { data: user, isLoading } = useQuery<UserType>({
    queryKey: ['get-user', id],
    queryFn: async () => {
      const { data } = await api.get<UserType>(`/users/${id}`);

      setValue('name', data.name);
      setValue('email', data.email);
      setValue('password', '');

      return data;
    },
    enabled: !!id,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
  });

  // Carregar permissões do usuário
  const { data: userPermissions } = useQuery<UserPermissionsResponse>({
    queryKey: ['get-user-permissions', id],
    queryFn: async () => {
      const { data } = await api.get<UserPermissionsResponse>(`/users/${id}/permissions`);
      return data;
    },
    enabled: !!id,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  // Atualizar selectedPermissions quando as permissões forem carregadas
  useEffect(() => {
    if (userPermissions?.permissions) {
      setSelectedPermissions(
        userPermissions.permissions.map(p => ({
          resource: p.resource,
          action: p.action
        }))
      );
    }
  }, [userPermissions]);

  const { mutate: update, isPending: updating } = useMutation({
    mutationFn: async (values: UserForm) => {
      const updateData = { ...values };
      if (!updateData.password) {
        delete updateData.password;
      }

      await api.patch(`/users/${id}`, updateData);

      // Atualizar permissões
      await api.post(`/users/${id}/permissions`, {
        userId: id,
        permissions: selectedPermissions
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-users'] });
      queryClient.invalidateQueries({ queryKey: ['get-user-permissions', id] });
      toast.success('Usuário atualizado com sucesso!');
      navigate('/users');
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando usuário...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Usuário não encontrado</p>
          <Link to="/users">
            <Button testID='back' className="mt-4">Voltar para lista</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PermissionGuard
      resource={PermissionResource.USERS}
      action={PermissionAction.UPDATE}
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <div className="text-center">
            <Title size="xl" className="text-foreground mb-2">
              Acesso Negado
            </Title>
            <Subtitle className="text-muted-foreground">
              Você não tem permissão para editar usuários
            </Subtitle>
          </div>
          <Link to="/users">
            <Button testID="back-to-users" type="secondary">Voltar para Usuários</Button>
          </Link>
        </div>
      }
    >
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
              Editar Usuário
            </Title>
            <Subtitle className="text-muted-foreground">
              Atualize as informações do usuário
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

                <div className="md:col-span-2">
                  <PasswordInput
                    inputFieldProps={{
                      testID: 'password-input',
                      label: 'Nova Senha (opcional)',
                      input: {
                        ...register('password'),
                        placeholder: 'Deixe em branco para manter a senha atual'
                      }
                    }}
                    leftIcon={<Lock className="w-5 h-5 text-muted-foreground" />}
                    errorMessage={errors.password?.message}
                  />
                </div>
              </div>
            </div>

            <div>
              <Title size="lg" className="text-card-foreground mb-4">
                Permissões
              </Title>
              <PermissionsSelector
                selectedPermissions={selectedPermissions}
                onChange={setSelectedPermissions}
              />
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <Button
                testID="save-button"
                type="primary"
                htmlType="submit"
                loading={updating}
                disabled={updating}
                className="shadow-primary"
              >
                <Save className="w-5 h-5 mr-2" />
                Atualizar Usuário
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
    </PermissionGuard>
  );
}
