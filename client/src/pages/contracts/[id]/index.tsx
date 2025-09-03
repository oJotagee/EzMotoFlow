"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Save, ArrowLeft, CreditCard, Upload } from 'lucide-react';
import { PaymentMethod, Contract, Client, Motorcycle } from '@/types';
import { Input, NumberInput, Textarea } from '@/components/ui/Input';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Selectize } from '@/components/ui/Selectize';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { Subtitle } from '@/components/ui/Subtitle';
import { Button } from '@/components/ui/Button';
import { Title } from '@/components/ui/Title';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '@/lib/api';
import { z } from 'zod';

const contractSchema = z.object({
  valor: z.number().min(0, 'Valor deve ser positivo'),
  data: z.string().min(1, 'Data é obrigatória'),
  observacao: z.string().optional(),
  pagamento: z.string().min(1, 'Forma de pagamento é obrigatória'),
  contractoPdf: z.string().optional(),
  motorcycleId: z.string().min(1, 'Motocicleta é obrigatória'),
  clientId: z.string().min(1, 'Cliente é obrigatório'),
});

type ContractForm = z.infer<typeof contractSchema>;

export default function EditContractPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control
  } = useForm<ContractForm>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      pagamento: '',
      motorcycleId: '',
      clientId: ''
    }
  });

  const watchedPagamento = watch('pagamento');
  const watchedMotorcycleId = watch('motorcycleId');
  const watchedClientId = watch('clientId');

  const onSubmit = (data: ContractForm) => update(data);

  const { data: contract, isLoading } = useQuery<Contract>({
    queryKey: ['get-contract', id],
    queryFn: async () => {
      const { data } = await api.get<Contract>(`/contracts/${id}`);

      setValue('valor', data.valor);
      setValue('data', new Date(data.data).toISOString().split('T')[0]);
      setValue('observacao', data.observacao || '');
      setValue('pagamento', data.pagamento);
      setValue('contractoPdf', data.contractoPdf || '');
      setValue('motorcycleId', data.motorcycleId);
      setValue('clientId', data.clientId);

      return data;
    },
    enabled: !!id,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
  });

  const { mutate: update, isPending: updating } = useMutation({
    mutationFn: async (values: ContractForm) => {
      await api.put(`/contracts/${id}`, {
        valor: values.valor,
        data: values.data,
        observacao: values.observacao,
        pagamento: values.pagamento,
        contractoPdf: values.contractoPdf,
        motorcycleId: values.motorcycleId,
        clientId: values.clientId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-contracts'] });
      toast.success('Contrato atualizado com sucesso!');
      navigate('/contracts');
    },
    onError: () => {
      toast.error('Erro ao atualizar contrato!');
    }
  });

  const { data: clientsData } = useQuery({
    queryKey: ['get-clients'],
    queryFn: async () => {
      const { data } = await api.get<Client[]>('/clients?limit=1000');
      return data;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const { data: motorcyclesData } = useQuery({
    queryKey: ['get-motorcycles'],
    queryFn: async () => {
      const { data } = await api.get<Motorcycle[]>('/motorcycles?limit=1000');
      return data;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando contrato...</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Contrato não encontrado</p>
          <Link to="/contracts">
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
        <Link to="/contracts">
          <Button testID="back-button" type="secondary" justIcon>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        
        <div>
          <Title size="2xl" className="text-foreground flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Editar Contrato
          </Title>
          <Subtitle className="text-muted-foreground">
            Atualize as informações do contrato
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
              Partes do Contrato
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Selectize
                label="Cliente"
                allOptions={[
                  { text: 'Selecione um cliente', value: '' },
                  ...(clientsData?.map((client) => ({
                    text: `${client.fullName} - ${client.documento}`,
                    value: client.id
                  })) || [])
                ]}
                selectedOptions={watchedClientId ? [
                  { 
                    text: clientsData?.find(c => c.id === watchedClientId)?.fullName || '',
                    value: watchedClientId 
                  }
                ] : []}
                setSelectedOptions={(options) => {
                  if (options.length > 0 && options[0].value) {
                    setValue('clientId', options[0].value)
                  } else {
                    setValue('clientId', '')
                  }
                }}
                multiple={false}
                search={true}
                error={!!errors.clientId}
                errorMessage={errors.clientId?.message}
                placeholder="Selecione um cliente"
              />

              <Selectize
                label="Motocicleta"
                allOptions={[
                  { text: 'Selecione uma motocicleta', value: '' },
                  ...(motorcyclesData?.map((motorcycle) => ({
                    text: `${motorcycle.nome} - ${motorcycle.placa} - R$ ${(motorcycle.valor_venda / 100).toFixed(2)}`,
                    value: motorcycle.id
                  })) || [])
                ]}
                selectedOptions={watchedMotorcycleId ? [
                  { 
                    text: motorcyclesData?.find(m => m.id === watchedMotorcycleId)?.nome || '',
                    value: watchedMotorcycleId 
                  }
                ] : []}
                setSelectedOptions={(options) => {
                  if (options.length > 0 && options[0].value) {
                    setValue('motorcycleId', options[0].value)
                  } else {
                    setValue('motorcycleId', '')
                  }
                }}
                multiple={false}
                search={true}
                error={!!errors.motorcycleId}
                errorMessage={errors.motorcycleId?.message}
                placeholder="Selecione uma motocicleta"
              />
            </div>
          </div>

          <div>
            <Title size="lg" className="text-card-foreground mb-4">
              Detalhes do Contrato
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Controller
                name="valor"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    inputFieldProps={{
                      testID: 'valor-input',
                      label: 'Valor do Contrato',
                      input: {
                        value: field.value || 0,
                        onValueChange: (values) => setValue('valor', parseFloat(values.value) || 0),
                        thousandSeparator: ".",
                        decimalSeparator: ",",
                        prefix: "R$ ",
                        decimalScale: 2,
                        fixedDecimalScale: true,
                        placeholder: "R$ 0,00"
                      }
                    }}
                    leftIcon={<CreditCard className="w-5 h-5 text-muted-foreground" />}
                    errorMessage={errors.valor?.message}
                  />
                )}
              />

              <Input
                inputFieldProps={{
                  testID: 'data-input',
                  label: 'Data do Contrato',
                  input: {
                    ...register('data'),
                    type: 'date'
                  }
                }}
                errorMessage={errors.data?.message}
                required
              />

              <Selectize
                label="Forma de Pagamento"
                allOptions={[
                  { text: 'Selecione...', value: '' },
                  { text: 'PIX', value: PaymentMethod.PIX },
                  { text: 'Cartão', value: PaymentMethod.CARTAO },
                  { text: 'Boleto', value: PaymentMethod.BOLETO }
                ]}
                selectedOptions={watchedPagamento ? [
                  { 
                    text: watchedPagamento === PaymentMethod.PIX ? 'PIX' : 
                    watchedPagamento === PaymentMethod.CARTAO ? 'Cartão' : 'Boleto',
                    value: watchedPagamento 
                  }
                ] : []}
                setSelectedOptions={(options) => {
                  if (options.length > 0 && options[0].value) {
                    setValue('pagamento', options[0].value as PaymentMethod)
                  } else {
                    setValue('pagamento', '' as any)
                  }
                }}
                multiple={false}
                search={false}
                error={!!errors.pagamento}
                errorMessage={errors.pagamento?.message}
                placeholder="Selecione a forma de pagamento"
              />

              <Input
                inputFieldProps={{
                  testID: 'contractoPdf-input',
                  label: 'PDF do Contrato (URL)',
                  input: {
                    ...register('contractoPdf'),
                    placeholder: 'https://exemplo.com/contrato.pdf'
                  }
                }}
                leftIcon={<Upload className="w-5 h-5 text-muted-foreground" />}
                errorMessage={errors.contractoPdf?.message}
              />
            </div>
          </div>

          <div>
            <Title size="lg" className="text-card-foreground mb-4">
              Observações
            </Title>
            <div className="grid grid-cols-1 gap-6">
              <Textarea
                textareaFieldProps={{
                  testID: 'observacao-textarea',
                  label: 'Observações',
                  textarea: {
                    ...register('observacao'),
                    placeholder: 'Observações adicionais sobre o contrato...',
                    rows: 3
                  }
                }}
                errorMessage={errors.observacao?.message}
              />
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
              Atualizar Contrato
            </Button>

            <Link to="/contracts">
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
