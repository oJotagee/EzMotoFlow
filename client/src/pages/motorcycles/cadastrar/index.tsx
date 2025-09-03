"use client"

import { Bike, Save, ArrowLeft, FileText, Palette, Calendar } from 'lucide-react';
import { Input, Textarea, MaskInput, NumberInput } from '@/components/ui/Input';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Selectize } from '@/components/ui/Selectize';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Subtitle } from '@/components/ui/Subtitle';
import { Button } from '@/components/ui/Button';
import { Title } from '@/components/ui/Title';
import { MotorcycleStatus } from '@/types';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '@/lib/api';
import { z } from 'zod';

const motorcycleSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cor: z.string().min(1, 'Cor é obrigatória'),
  placa: z.string().min(1, 'Placa é obrigatória').regex(/^[A-Za-z]{3}-[0-9]{4}$/, 'Placa deve estar no formato ABC-1234'),
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

export default function CreateMotorcyclePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<MotorcycleForm>({
    resolver: zodResolver(motorcycleSchema),
    defaultValues: {
      valor_compra: 0,
      valor_venda: 0,
      valor_fipe: 0
    }
  });

  const onSubmit = (data: any) => save(data);


  const { mutate: save, isPending: sending } = useMutation({
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

      const response = await api.post('/motorcycle', payload);
      return response.data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['get-motorcycles'] });
      toast.success('Motocicleta criada com sucesso!');
      navigate('/motorcycles');
    },
    onError(error: any) {
      console.error('Erro na mutação:', error);
      
      toast.error('Erro ao criar motocicleta!');
    }
  });

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
            Nova Motocicleta
          </Title>
          <Subtitle className="text-muted-foreground">
            Preencha os dados para cadastrar uma nova motocicleta
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

              <MaskInput
                inputFieldProps={{
                  testID: 'placa-input',
                  label: 'Placa',
                  mask: 'aaa-9999',
                  input: {
                    ...register('placa'),
                    placeholder: 'ABC-1234'
                  }
                }}
                leftIcon={<FileText className="w-5 h-5 text-muted-foreground" />}
                errorMessage={errors.placa?.message}
                required
              />

              <MaskInput
                inputFieldProps={{
                  testID: 'ano-input',
                  label: 'Ano',
                  mask: '9999',
                  input: {
                    ...register('ano'),
                    placeholder: '2020'
                  }
                }}
                leftIcon={<Calendar className="w-5 h-5 text-muted-foreground" />}
                errorMessage={errors.ano?.message}
                required
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

              <MaskInput
                inputFieldProps={{
                  testID: 'renavam-input',
                  label: 'Renavam',
                  mask: '99999999999',
                  input: {
                    ...register('renavam'),
                    placeholder: 'Digite o renavam (11 dígitos)'
                  }
                }}
                errorMessage={errors.renavam?.message}
                required
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
              <NumberInput
                inputFieldProps={{
                  testID: 'valor_compra-input',
                  label: 'Valor de Compra',
                  input: {
                    ...register('valor_compra'),
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

              <NumberInput
                inputFieldProps={{
                  testID: 'valor_venda-input',
                  label: 'Valor de Venda',
                  input: {
                    ...register('valor_venda'),
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

              <NumberInput
                inputFieldProps={{
                  testID: 'valor_fipe-input',
                  label: 'Valor FIPE',
                  input: {
                    ...register('valor_fipe'),
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
              loading={sending}
              disabled={sending}
              className="shadow-primary"
            >
              <Save className="w-5 h-5 mr-2" />
              Criar Motocicleta
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
