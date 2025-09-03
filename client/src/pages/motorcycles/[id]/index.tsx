"use client"

import { Bike, Save, ArrowLeft, FileText, Palette, Calendar } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input, Textarea, MaskInput, NumberInput } from '@/components/ui/Input';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Motorcycle } from '@/types';
import { useForm, Controller } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Subtitle } from '@/components/ui/Subtitle';
import { Button } from '@/components/ui/Button';
import { Title } from '@/components/ui/Title';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '@/lib/api';
import { z } from 'zod';

const motorcycleSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cor: z.string().min(1, 'Cor é obrigatória'),
  placa: z.string().min(1, 'Placa é obrigatória').transform(val => val.toUpperCase()),
  ano: z.string().length(4, 'Ano deve ter exatamente 4 dígitos').regex(/^\d{4}$/, 'Ano deve conter apenas números'),
  chassi: z.string().length(17, 'Chassi deve ter exatamente 17 caracteres'),
  renavam: z.string().length(11, 'Renavam deve ter exatamente 11 dígitos').regex(/^\d{11}$/, 'Renavam deve conter apenas números'),
  km: z.string().min(1, 'Quilometragem é obrigatória'),
  valor_compra: z.number().min(0, 'Valor de compra deve ser positivo'),
  valor_venda: z.number().min(0, 'Valor de venda deve ser positivo'),
  valor_fipe: z.number().min(0, 'Valor FIPE deve ser positivo'),
  observacao: z.string().optional(),
  foto1: z.string().optional(),
  foto2: z.string().optional(),
  foto3: z.string().optional(),
});

type MotorcycleForm = z.infer<typeof motorcycleSchema>;

export default function EditMotorcyclePage() {
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
  } = useForm<MotorcycleForm>({
    resolver: zodResolver(motorcycleSchema),
    mode: 'onChange',
    defaultValues: {
      valor_compra: 0,
      valor_venda: 0,
      valor_fipe: 0
    }
  });

  const onSubmit = (data: any) => update(data);

  const { data: motorcycle, isLoading } = useQuery<Motorcycle>({
    queryKey: ['get-motorcycle', id],
    queryFn: async () => {
      const { data } = await api.get<Motorcycle>(`/motorcycle/${id}`);

      setValue('nome', data.nome);
      setValue('cor', data.cor);
             setValue('placa', data.placa ? data.placa.toUpperCase() : '');
      setValue('ano', data.ano ? data.ano.substring(0, 4) : '');
      setValue('chassi', data.chassi);
      setValue('renavam', data.renavam);
      setValue('km', data.km);
      setValue('valor_compra', data.valor_compra);
      setValue('valor_venda', data.valor_venda);
      setValue('valor_fipe', data.valor_fipe);
      setValue('observacao', data.observacao || '');
      setValue('foto1', data.foto1 || '');
      setValue('foto2', data.foto2 || '');
      setValue('foto3', data.foto3 || '');

      return data;
    },
    enabled: !!id,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
  });

  const { mutate: update, isPending: updating } = useMutation({
    mutationFn: async (values: any) => {
      const valor_compra = typeof values.valor_compra === 'number' ? values.valor_compra : 0;
      const valor_venda = typeof values.valor_venda === 'number' ? values.valor_venda : 0;
      const valor_fipe = typeof values.valor_fipe === 'number' ? values.valor_fipe : 0;

      const payload = {
        nome: values.nome,
        cor: values.cor,
        placa: values.placa.replace("-", ""),
        ano: values.ano,
        chassi: values.chassi,
        renavam: values.renavam,
        km: values.km,
        valor_compra: valor_compra,
        valor_venda: valor_venda,
        valor_fipe: valor_fipe,
        observacao: values.observacao || '',
        foto1: values.foto1 || '',
        foto2: values.foto2 || '',
        foto3: values.foto3 || '',
      };

      const response = await api.patch(`/motorcycle/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-motorcycles'] });
      toast.success('Motocicleta atualizada com sucesso!');
      navigate('/motorcycles');
    },
    onError(error: any) {
      console.error('Erro na mutação:', error);
      
      toast.error("Erro ao atualizar motocicleta!");
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando motocicleta...</p>
        </div>
      </div>
    );
  }

  if (!motorcycle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Motocicleta não encontrada</p>
          <Link to="/motorcycles">
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
        <Link to="/motorcycles">
          <Button testID="back-button" type="secondary" justIcon>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        
        <div>
          <Title size="2xl" className="text-foreground flex items-center gap-3">
            <Bike className="w-8 h-8 text-primary" />
            Editar Motocicleta
          </Title>
          <Subtitle className="text-muted-foreground">
            Atualize as informações da motocicleta
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
              <Input
                inputFieldProps={{
                  testID: 'nome-input',
                  label: 'Nome/Modelo',
                  input: {
                    ...register('nome'),
                    placeholder: 'Ex: Honda CB 600F Hornet'
                  }
                }}
                leftIcon={<Bike className="w-5 h-5 text-muted-foreground" />}
                errorMessage={errors.nome?.message}
                required
              />

              <Input
                inputFieldProps={{
                  testID: 'cor-input',
                  label: 'Cor',
                  input: {
                    ...register('cor'),
                    placeholder: 'Ex: Vermelho'
                  }
                }}
                leftIcon={<Palette className="w-5 h-5 text-muted-foreground" />}
                errorMessage={errors.cor?.message}
                required
              />

              <Controller
                name="placa"
                control={control}
                render={({ field }) => (
                  <MaskInput
                    inputFieldProps={{
                      testID: 'placa-input',
                      label: 'Placa',
                      mask: 'aaa-9999',
                      input: {
                        ...field,
                        placeholder: 'ABC-1234',
                        onChange: (e) => {
                          const value = e.target.value.toUpperCase();
                          field.onChange(value);
                        }
                      }
                    }}
                    leftIcon={<FileText className="w-5 h-5 text-muted-foreground" />}
                    errorMessage={errors.placa?.message}
                    required
                  />
                )}
              />

              <Controller
                name="ano"
                control={control}
                render={({ field }) => (
                  <MaskInput
                    inputFieldProps={{
                      testID: 'ano-input',
                      label: 'Ano',
                      mask: '9999',
                      input: {
                        ...field,
                        placeholder: '2020'
                      }
                    }}
                    leftIcon={<Calendar className="w-5 h-5 text-muted-foreground" />}
                    errorMessage={errors.ano?.message}
                    required
                  />
                )}
              />

              <Input
                inputFieldProps={{
                  testID: 'chassi-input',
                  label: 'Chassi',
                  input: {
                    ...register('chassi'),
                    placeholder: 'Digite o chassi (17 caracteres)',
                    maxLength: 17,
                    minLength: 17
                  }
                }}
                errorMessage={errors.chassi?.message}
                required
              />

              <Controller
                name="renavam"
                control={control}
                render={({ field }) => (
                  <MaskInput
                    inputFieldProps={{
                      testID: 'renavam-input',
                      label: 'Renavam',
                      mask: '99999999999',
                      input: {
                        ...field,
                        placeholder: 'Digite o renavam (11 dígitos)'
                      }
                    }}
                    errorMessage={errors.renavam?.message}
                    required
                  />
                )}
              />

              <Input
                inputFieldProps={{
                  testID: 'km-input',
                  label: 'Quilometragem',
                  input: {
                    ...register('km'),
                    placeholder: '0'
                  }
                }}
                errorMessage={errors.km?.message}
                required
              />


            </div>
          </div>

          <div>
            <Title size="lg" className="text-card-foreground mb-4">
              Informações Financeiras
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Controller
                name="valor_compra"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    inputFieldProps={{
                      testID: 'valor_compra-input',
                      label: 'Valor de Compra',
                      input: {
                        ...field,
                        prefix: "R$",
                        decimalScale: 2,
                        decimalSeparator: ",",
                        thousandSeparator: ".",
                        placeholder: "Insira o valor de compra",
                        onChange: (e) => {
                          const format = e.target.value.replace(/\D/g, '');
                          setValue("valor_compra", Number(format))
                        },
                      },
                    }}
                    errorMessage={errors.valor_compra?.message}
                  />
                )}
              />

              <Controller
                name="valor_venda"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    inputFieldProps={{
                      testID: 'valor_venda-input',
                      label: 'Valor de Venda',
                      input: {
                        ...field,
                        prefix: "R$",
                        decimalScale: 2,
                        decimalSeparator: ",",
                        thousandSeparator: ".",
                        placeholder: "Insira o valor de venda",
                        onChange: (e) => {
                          const format = e.target.value.replace(/\D/g, '');
                          setValue("valor_venda", Number(format))
                        },
                      },
                    }}
                    errorMessage={errors.valor_venda?.message}
                  />
                )}
              />

              <Controller
                name="valor_fipe"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    inputFieldProps={{
                      testID: 'valor_fipe-input',
                      label: 'Valor FIPE',
                      input: {
                        ...field,
                        prefix: "R$",
                        decimalScale: 2,
                        decimalSeparator: ",",
                        thousandSeparator: ".",
                        placeholder: "Insira o valor FIPE",
                        onChange: (e) => {
                          const format = e.target.value.replace(/\D/g, '');
                          setValue("valor_fipe", Number(format))
                        },
                      },
                    }}
                    errorMessage={errors.valor_fipe?.message}
                  />
                )}
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
                    placeholder: 'Observações adicionais sobre a motocicleta...',
                    rows: 3
                  }
                }}
                errorMessage={errors.observacao?.message}
              />
            </div>
          </div>

          <div>
            <Title size="lg" className="text-card-foreground mb-4">
              Fotos da Motocicleta
            </Title>
            <div className="grid grid-cols-1 gap-6">
              <ImageUpload
                label="Upload de Imagens"
                maxFiles={3}
                acceptedFileTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
                maxFileSize={5 * 1024 * 1024}
                convertToBase64={true}
                initialImages={[motorcycle?.foto1, motorcycle?.foto2, motorcycle?.foto3].filter(Boolean)}
                onImagesChange={(images) => {
                  const foto1 = images[0]?.base64 || images[0]?.url || '';
                  const foto2 = images[1]?.base64 || images[1]?.url || '';
                  const foto3 = images[2]?.base64 || images[2]?.url || '';
                  
                  setValue('foto1', foto1);
                  setValue('foto2', foto2);
                  setValue('foto3', foto3);
                }}
                className="w-full"
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
              Atualizar Motocicleta
            </Button>

            <Link to="/motorcycles">
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
