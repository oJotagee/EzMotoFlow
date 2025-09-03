import { User, Save, ArrowLeft, Mail, Phone, Building, MapPin, Calendar } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Input, MaskInput } from '@/components/ui/Input';
import { useForm, Controller } from 'react-hook-form';
import { Selectize } from '@/components/ui/Selectize';
import { zodResolver } from '@hookform/resolvers/zod';
import { Subtitle } from '@/components/ui/Subtitle';
import { Button } from '@/components/ui/Button';
import { Title } from '@/components/ui/Title';
import { ClientType, Client } from '@/types';
import { motion } from 'framer-motion';
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

export default function EditClientPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
    setError
  } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      tipo: ''
    }
  });

  const watchedTipo = watch('tipo');

  const onSubmit = (data: ClientForm) => update(data);

  const { data: client, isLoading } = useQuery<Client>({
    queryKey: ['get-client', id],
    queryFn: async () => {
      const { data } = await api.get<Client>(`/clients/${id}`);

      setValue('tipo', data.tipo);
      setValue('fullName', data.fullName);
      setValue('documento', data.documento);
      setValue('telefone', data.telefone || '');
      setValue('email', data.email);
      setValue('dataNascimento', data.dataNascimento.split("T")[0] || '');
      setValue('companyName', data.companyName || '');
      setValue('cep', data.cep);
      setValue('rua', data.rua);
      setValue('numero', data.numero);
      setValue('bairro', data.bairro);
      setValue('cidade', data.cidade);
      setValue('estado', data.estado);
      setValue('complementos', data.complementos || '');

      return data;
    },
    enabled: !!id,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
  });

  const { mutate: update, isPending: updating } = useMutation({
    mutationFn: async (values: ClientForm) => {
      await api.patch(`/clients/${id}`, {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-clients'] });
      toast.success('Cliente atualizado com sucesso!');
      navigate('/clients');
    },
    onError: () => {
      toast.error('Erro ao atualizar cliente!');
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando cliente...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Cliente não encontrado</p>
          <Link to="/clients">
            <Button testID='back' className="mt-4">Voltar para lista</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            Editar Cliente
          </Title>
          <Subtitle className="text-muted-foreground">
            Atualize as informações do cliente
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

              <Controller
                name="documento"
                control={control}
                render={({ field }) => (
                  <MaskInput
                    inputFieldProps={{
                      testID: 'documento-input',
                      label: watchedTipo === ClientType.PESSOA_FISICA ? 'CPF' : 'CNPJ',
                      mask: watchedTipo === ClientType.PESSOA_FISICA ? '999.999.999-99' : '99.999.999/9999-99',
                      input: {
                        ...field,
                        placeholder: watchedTipo === ClientType.PESSOA_FISICA ? '000.000.000-00' : '00.000.000/0000-00'
                      }
                    }}
                    errorMessage={errors.documento?.message}
                    required
                  />
                )}
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

              <Controller
                name="telefone"
                control={control}
                render={({ field }) => (
                  <MaskInput
                    inputFieldProps={{
                      testID: 'telefone-input',
                      label: 'Telefone',
                      mask: '(99) 99999-9999',
                      input: {
                        ...field,
                        placeholder: '(00) 00000-0000'
                      }
                    }}
                    leftIcon={<Phone className="w-5 h-5 text-muted-foreground" />}
                    errorMessage={errors.telefone?.message}
                  />
                )}
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
              <Controller
                name="cep"
                control={control}
                render={({ field }) => (
                  <MaskInput
                    inputFieldProps={{
                      testID: 'cep-input',
                      label: 'CEP',
                      mask: '99999-999',
                      input: {
                        ...field,
                        placeholder: '00000-000',
                        onChange: (e) => {
                          const value = e.target.value;
                          setValue('cep', value);
                          callCep(value);
                        }
                      }
                    }}
                    leftIcon={<MapPin className="w-5 h-5 text-muted-foreground" />}
                    errorMessage={errors.cep?.message}
                    required
                  />
                )}
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
              loading={updating}
              disabled={updating}
              className="shadow-primary"
            >
              <Save className="w-5 h-5 mr-2" />
              Atualizar Cliente
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
