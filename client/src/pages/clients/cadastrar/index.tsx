"use client"

import { User, Save, ArrowLeft, Mail, Phone, Building, MapPin, Calendar } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input, MaskInput } from '@/components/ui/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Selectize } from '@/components/ui/Selectize';
import { Link, useNavigate } from 'react-router-dom';
import { Subtitle } from '@/components/ui/Subtitle';
import { Button } from '@/components/ui/Button';
import { Title } from '@/components/ui/Title';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ClientType } from '@/types';
import { cepApi } from '@/lib/cep';
import { toast } from 'sonner';
import api from '@/lib/api';
import { z } from 'zod';

const clientSchema = z.object({
  tipo: z.string().min(1, 'Tipo de cliente é obrigatório'),
  fullName: z.string().min(1, 'Nome é obrigatório'),
  documento: z.string().min(1, 'Documento é obrigatório'),
  telefone: z.string().optional(),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  dataNascimento: z.string().optional(),
  companyName: z.string().optional(),
  cep: z.string().min(1, 'CEP é obrigatório'),
  rua: z.string().min(1, 'Rua é obrigatória'),
  numero: z.string().min(1, 'Número é obrigatório'),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  estado: z.string().min(1, 'Estado é obrigatório'),
  complementos: z.string().optional(),
});

type ClientForm = z.infer<typeof clientSchema>;

export default function CreateClientPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError
  } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      tipo: ''
    }
  });

  const watchedTipo = watch('tipo');

  const onSubmit = (data: ClientForm) => save(data);

  const { mutate: save, isPending: sending } = useMutation({
    mutationFn: async (values: ClientForm) => {
      await api.post('/clients', {
        tipo: values.tipo,
        fullName: values.fullName,
        documento: values.documento.replace(/\D/g, ''),
        telefone: values.telefone.replace(/\D/g, ''),
        email: values.email,
        dataNascimento: values.dataNascimento,
        companyName: values.companyName,
        cep: values.cep.replace(/\D/g, ''),
        rua: values.rua,
        numero: values.numero,
        bairro: values.bairro,
        cidade: values.cidade,
        estado: values.estado,
        complementos: values.complementos,
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['get-clients'] });
      toast.success('Cliente criado com sucesso!');
      navigate('/clients');
    },
    onError() {
      toast.error('Erro ao criar cliente!');
    }
  });

  const { mutate: callCep, isPending: isCallingCep } = useMutation({
    mutationKey: ["CallCep"],
    mutationFn: async (cep: string) => {
      const cepFormated = cep.replace("-", "").replace("_", "")

      setValue("rua", "");
      setValue("numero", "");
      setValue("bairro", "");
      setValue("estado", "");
      setValue("cidade", "");
      setValue("complementos", "");

      if(cepFormated.length === 8) {
        try {
          const { data } = await cepApi.get(`${cepFormated}/json`)

          if(data.erro) throw new Error("Cep Invalido")

          setValue("rua", data.logradouro || "");
          setValue("bairro", data.bairro || "");
          setValue("cidade", data.localidade || "");
          setValue("estado", data.uf || "");
        } catch (err) {
          toast.error("Algo deu errado!");
        }
      }
    },
    onError(e) {
      toast.error("CEP inválido.");

      setError("cep", { type: "manual", message: "CEP inválido." });
    },
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link to="/clients">
          <Button testID="back-button" type="secondary" justIcon>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        
        <div>
          <Title size="2xl" className="text-foreground flex items-center gap-3">
            <User className="w-8 h-8 text-primary" />
            Novo Cliente
          </Title>
          <Subtitle className="text-muted-foreground">
            Preencha os dados para cadastrar um novo cliente
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
              Informações Básicas
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Selectize
                label="Tipo de Cliente"
                allOptions={[
                  { text: 'Selecione...', value: '' },
                  { text: 'Pessoa Física', value: ClientType.PESSOA_FISICA },
                  { text: 'Pessoa Jurídica', value: ClientType.PESSOA_JURIDICA }
                ]}
                selectedOptions={watchedTipo ? [
                  { text: watchedTipo === ClientType.PESSOA_FISICA ? 'Pessoa Física' : 'Pessoa Jurídica', value: watchedTipo }
                ] : []}
                setSelectedOptions={(options) => {
                  if (options.length > 0 && options[0].value) {
                    setValue('tipo', options[0].value as ClientType)
                  } else {
                    setValue('tipo', '' as any)
                  }
                }}
                multiple={false}
                search={false}
                error={!!errors.tipo}
                errorMessage={errors.tipo?.message}
                placeholder="Selecione o tipo de cliente"
              />

              <Input
                inputFieldProps={{
                  testID: 'fullName-input',
                  label: watchedTipo === ClientType.PESSOA_FISICA ? 'Nome Completo' : 'Razão Social',
                  input: {
                    ...register('fullName'),
                    placeholder: watchedTipo === ClientType.PESSOA_FISICA ? 'Digite o nome completo' : 'Digite a razão social'
                  }
                }}
                leftIcon={watchedTipo === ClientType.PESSOA_FISICA ? 
                  <User className="w-5 h-5 text-muted-foreground" /> : 
                  <Building className="w-5 h-5 text-muted-foreground" />
                }
                errorMessage={errors.fullName?.message}
                required
              />

              <MaskInput
                inputFieldProps={{
                  testID: 'documento-input',
                  label: watchedTipo === ClientType.PESSOA_FISICA ? 'CPF' : 'CNPJ',
                  mask: watchedTipo === ClientType.PESSOA_FISICA ? '999.999.999-99' : '99.999.999/9999-99',
                  input: {
                    ...register('documento'),
                    placeholder: watchedTipo === ClientType.PESSOA_FISICA ? '000.000.000-00' : '00.000.000/0000-00'
                  }
                }}
                errorMessage={errors.documento?.message}
                required
              />

              <Input
                inputFieldProps={{
                  testID: 'email-input',
                  label: 'Email',
                  input: {
                    ...register('email'),
                    type: 'email',
                    placeholder: 'Digite o email'
                  }
                }}
                leftIcon={<Mail className="w-5 h-5 text-muted-foreground" />}
                errorMessage={errors.email?.message}
                required
              />

              <MaskInput
                inputFieldProps={{
                  testID: 'telefone-input',
                  label: 'Telefone',
                  mask: '(99) 99999-9999',
                  input: {
                    ...register('telefone'),
                    placeholder: '(00) 00000-0000'
                  }
                }}
                leftIcon={<Phone className="w-5 h-5 text-muted-foreground" />}
                errorMessage={errors.telefone?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {watchedTipo === ClientType.PESSOA_FISICA && (
                <Input
                  inputFieldProps={{
                    testID: 'dataNascimento-input',
                    label: 'Data de Nascimento',
                    input: {
                      ...register('dataNascimento'),
                      type: 'date'
                    }
                  }}
                  leftIcon={<Calendar className="w-5 h-5 text-muted-foreground" />}
                  errorMessage={errors.dataNascimento?.message}
                />
              )}

              {watchedTipo === ClientType.PESSOA_JURIDICA && (
                <Input
                  inputFieldProps={{
                    testID: 'companyName-input',
                    label: 'Nome Fantasia',
                    input: {
                      ...register('companyName'),
                      placeholder: 'Digite o nome fantasia'
                    }
                  }}
                  leftIcon={<Building className="w-5 h-5 text-muted-foreground" />}
                  errorMessage={errors.companyName?.message}
                />
              )}
            </div>
          </div>

          <div>
            <Title size="lg" className="text-card-foreground mb-4">
              Endereço
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MaskInput
                inputFieldProps={{
                  testID: 'cep-input',
                  label: 'CEP',
                  mask: '99999-999',
                  input: {
                    ...register('cep', {
                      onChange: (e) => {
                        const value = e.target.value;
                        setValue('cep', value);
                        callCep(value);
                      }
                    }),
                    placeholder: '00000-000'
                  }
                }}
                leftIcon={<MapPin className="w-5 h-5 text-muted-foreground" />}
                errorMessage={errors.cep?.message}
                required
              />

              <Input
                inputFieldProps={{
                  testID: 'rua-input',
                  label: 'Rua/Logradouro',
                  input: {
                    ...register('rua'),
                    placeholder: 'Digite a rua'
                  }
                }}
                errorMessage={errors.rua?.message}
                required
              />

              <Input
                inputFieldProps={{
                  testID: 'numero-input',
                  label: 'Número',
                  input: {
                    ...register('numero'),
                    placeholder: '123'
                  }
                }}
                errorMessage={errors.numero?.message}
                required
              />

              <Input
                inputFieldProps={{
                  testID: 'bairro-input',
                  label: 'Bairro',
                  input: {
                    ...register('bairro'),
                    placeholder: 'Digite o bairro'
                  }
                }}
                errorMessage={errors.bairro?.message}
                required
              />

              <Input
                inputFieldProps={{
                  testID: 'cidade-input',
                  label: 'Cidade',
                  input: {
                    ...register('cidade'),
                    placeholder: 'Digite a cidade'
                  }
                }}
                errorMessage={errors.cidade?.message}
                required
              />

              <Input
                inputFieldProps={{
                  testID: 'estado-input',
                  label: 'Estado',
                  input: {
                    ...register('estado'),
                    placeholder: 'SP'
                  }
                }}
                errorMessage={errors.estado?.message}
                required
              />

              <div className="lg:col-span-2">
                <Input
                  inputFieldProps={{
                    testID: 'complementos-input',
                    label: 'Complemento',
                    input: {
                      ...register('complementos'),
                      placeholder: 'Apto, bloco, etc.'
                    }
                  }}
                  errorMessage={errors.complementos?.message}
                />
              </div>
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
              Criar Cliente
            </Button>

            <Link to="/clients">
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
