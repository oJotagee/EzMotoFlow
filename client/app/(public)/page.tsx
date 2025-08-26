"use client";

import { Input, PasswordInput } from '../../components/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '../../components/Button';
import { Title } from '../../components/Title';
import { useUser } from '../../store/userStore';
import { MdOutlineLock } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { FaRegUser } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { Bike } from 'lucide-react';
import { api } from '../../lib/api';
import Cookies from "js-cookie";
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type Register = z.infer<typeof schema>;

export default function Login() {
  const router = useRouter();
  const { setUser } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<Register>({
    resolver: zodResolver(schema),
    mode: "onChange"
  });

  const { mutate, isPending: sending } = useMutation({
    mutationFn: async (values: Register) => {
      const { data } = await api.post("/auth", {
        email: values.email,
        password: values.password,
      });

      return data
    },
    onSuccess(data) {
      console.log(data)
      setUser({
        expiration: data.dtExpiration,
        token: data.token,
        email: data.userEmail,
        id: data.userId,
        nome: data.userName,
      });

      Cookies.set("user-pre-auth", data.token);
      Cookies.set("user-auth", data.token);

      router.push(`/backoffice/`);
    },
    onError(error) {
      setError("email", {
        message: "E-mail inválido, tente novamente!",
      });

      setError("password", {
        message: "Senha inválida, tente novamente!",
      });
    },
  });

  const onSubmit = (values: any) => mutate(values)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <Bike className="h-8 w-8 text-white" />
          </div>
        </div>

        <Title size="lg" bold="bold" className="text-gray-900 text-center mb-2">
          EzMotoFlow
        </Title>

        <Title size="base" bold="normal" className="text-gray-600 text-center mb-8">
          Faça login para acessar o painel administrativo
        </Title>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            inputFieldProps={{
              testID: "Email",
              label: "Email",
              input: {
                ...register("email"),
                disabled: isSubmitting,
                id: "Email",
                placeholder: "seu@email.com",
              },
            }}
            leftIcon={<FaRegUser className="w-4 h-4" />}
            errorMessage={(errors.email?.message as string) || undefined}
          />

          <PasswordInput
            inputFieldProps={{
              testID: "Senha",
              label: "Senha",
              input: {
                ...register("password"),
                disabled: isSubmitting,
                id: "Senha",
                placeholder: "********",
              },
            }}
            leftIcon={<MdOutlineLock className="w-4 h-4 text-gray-400" />}
            errorMessage={(errors.password?.message as string) || undefined}
          />

          <Button
            testID="Entrar"
            onClick={handleSubmit(onSubmit)}
            loading={sending}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}