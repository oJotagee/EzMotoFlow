"use client";

import { Input, PasswordInput } from '../../components/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '../../components/Button';
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
    mutationFn: async (values: any) => {
      const { data } = await api.post("/Auth", {
        login: values.Email,
        password: values.Senha,
      });

      console.log(data)

      return data
    },
    onSuccess(data) {
      setUser({
        expiration: data.data.dtExpiration,
        token: data.data.token,
        email: data.data.userEmail,
        id: data.data.userId,
        nome: data.data.userName,
      });

      Cookies.set("user-pre-auth", data.data.token);
      Cookies.set("user-auth", data.data.token);

      router.push(`/backoffice/Home`);
    },
    onError(error) {
      setError("email", {
        message: "E-mail inválidos, tente novamente!",
      });

      setError("password", {
        message: "Senha inválidos, tente novamente!",
      });
    },
  });

  const onSubmit = (values: any) => mutate(values)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 px-4">
      <Card className="w-full max-w-md card-elevated">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Bike className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Entrar no Sistema
          </CardTitle>
          <p className="text-muted-foreground text-center">
            Faça login para acessar o painel administrativo
          </p>
        </CardHeader>
        
        <CardContent>
          <form className="space-y-4 flex w-full flex-col gap-6">
            <Input
              inputFieldProps={{
                testID: "Email",
                label: "Usuário / e-mail",
                input: {
                  ...register("email"),
                  disabled: isSubmitting,
                  id: "Email",
                  placeholder: "Insira seu nome de usuário ou e-mail",
                },
              }}
              leftIcon={<FaRegUser className="w-4 h-4 mx-2" />}
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
                  placeholder: "Insira sua senha",
                },
              }}
              leftIcon={<MdOutlineLock className="w-5 h-5 mx-2" />}
              errorMessage={(errors.password?.message as string) || undefined}
              message={
                <span
                  className="text-[#FFA200] cursor-pointer hover:underline"
                  onClick={() => router.push("/esqueceu-sua-senha")}
                >
                  Esqueceu sua senha?
                </span>
              }
            />
            <Button
              testID="Entrar"
              onClick={handleSubmit(onSubmit)}
              loading={sending}
              color={"#FFA200"}
            >
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}