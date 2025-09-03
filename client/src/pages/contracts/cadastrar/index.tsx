"use client"

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { FileText, Save, ArrowLeft, CreditCard, Upload } from 'lucide-react';
import { Input, NumberInput, Textarea } from '@/components/ui/Input';
import { PaymentMethod, Client, Motorcycle } from '@/types';
import { Selectize } from '@/components/ui/Selectize';
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

export default function CreateContractPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
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

  const onSubmit = (data: ContractForm) => save(data);

  const { mutate: save, isPending: sending } = useMutation({
    mutationFn: async (values: ContractForm) => {
      await api.post('/contracts', {
        valor: values.valor,
        data: values.data,
        observacao: values.observacao,
        pagamento: values.pagamento,
        contractoPdf: values.contractoPdf,
        motorcycleId: values.motorcycleId,
        clientId: values.clientId,
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['get-contracts'] });
      toast.success('Contrato criado com sucesso!');
      toast.info('Para integração com Clicksign, conecte seu projeto ao Supabase!');
      navigate('/contracts');
    },
    onError() {
      toast.error('Erro ao criar contrato!');
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
            Novo Contrato
          </Title>
          <Subtitle className="text-muted-foreground">
            Preencha os dados para criar um novo contrato
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
              <NumberInput
                inputFieldProps={{
                  testID: 'valor-input',
                  label: 'Valor do Contrato',
                  input: {
                    value: watch('valor') || 0,
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
              loading={sending}
              disabled={sending}
              className="shadow-primary"
            >
              <Save className="w-5 h-5 mr-2" />
              Criar Contrato
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
