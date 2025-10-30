import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function SignContractPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const sigPad = useRef<SignatureCanvas>(null);
  const [isSigned, setIsSigned] = useState(false);

  const { data: contract, isLoading } = useQuery({
    queryKey: ['contract-signature', id, token],
    queryFn: async () => {
      const { data } = await api.get(`/contract/sign/${id}?token=${token}`);
      return data;
    },
    enabled: !!id && !!token,
  });

  const { mutate: signContract, isPending } = useMutation({
    mutationFn: async (signatureData: any) => {
      await api.post(`/contract/sign/${id}?token=${token}`, signatureData);
    },
    onSuccess: () => {
      toast.success('Contrato assinado com sucesso!');
      setIsSigned(true);
    },
    onError: () => {
      toast.error('Erro ao assinar contrato');
    },
  });

  const handleSign = () => {
    if (sigPad.current?.isEmpty()) {
      toast.error('Por favor, faça sua assinatura');
      return;
    }

    const signatureDataURL = sigPad.current?.toDataURL();
    signContract({
      signature: signatureDataURL,
      signedAt: new Date().toISOString(),
      signerName: contract?.client?.fullName,
    });
  };

  const clearSignature = () => {
    sigPad.current?.clear();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Carregando contrato...</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Contrato não encontrado
          </h1>
          <p className="text-gray-600">
            O token pode ser inválido ou ter expirado
          </p>
        </div>
      </div>
    );
  }

  if (isSigned) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Contrato Assinado com Sucesso!
          </h1>
          <p className="text-lg text-gray-600">
            Obrigado por assinar o contrato. Um email de confirmação foi enviado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assinatura de Contrato
          </h1>
          <p className="text-gray-600">
            Por favor, revise os detalhes e assine o contrato abaixo
          </p>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Detalhes do Contrato
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded">
              <strong className="text-gray-700">Cliente:</strong>
              <p className="text-gray-900">{contract.client.fullName}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <strong className="text-gray-700">Motocicleta:</strong>
              <p className="text-gray-900">{contract.motorcycle.nome}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <strong className="text-gray-700">Valor:</strong>
              <p className="text-gray-900">R$ {(contract.valor / 100).toFixed(2)}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <strong className="text-gray-700">Data:</strong>
              <p className="text-gray-900">{new Date(contract.data).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Sua Assinatura
          </h3>
          <p className="text-gray-600 mb-4">
            Use o mouse ou toque na tela para desenhar sua assinatura no campo abaixo:
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg mb-4 p-2">
            <SignatureCanvas
              ref={sigPad}
              canvasProps={{
                width: 500,
                height: 200,
                className: 'signature-canvas w-full border rounded'
              }}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={clearSignature}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Limpar Assinatura
            </button>
            <button
              onClick={handleSign}
              disabled={isPending}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex-1 sm:flex-none"
            >
              {isPending ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Assinando...
                </span>
              ) : (
                'Assinar Contrato'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}