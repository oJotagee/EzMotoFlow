import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import api from '@/lib/api';
import jsPDF from 'jspdf';

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
    mutationFn: async (requestData: any) => {
      await api.post(`/contract/sign/${id}?token=${token}`, {
        signatureData: {
          signature: requestData.signature,
          signedAt: requestData.signedAt,
          signerName: requestData.signerName,
        },
        contractPdf: requestData.contractPdf,
      });
    },
    onSuccess: () => {
      toast.success('Contrato assinado com sucesso!');
      setIsSigned(true);
    },
    onError: () => {
      toast.error('Erro ao assinar contrato');
    },
  });

  const generateContractPDF = async (signatureDataURL: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '210mm';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.fontSize = '14px';
    tempDiv.style.lineHeight = '1.5';
    tempDiv.style.color = 'black';

    // Conteúdo do contrato com a assinatura
    tempDiv.innerHTML = `
      <div style="padding: 32px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
          <div>
            <h1 style="font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 8px;">EzMotoFlow</h1>
          </div>
        </div>

        <!-- Título -->
        <div style="text-align: center; padding: 24px 0; border-bottom: 2px solid black; margin-bottom: 24px;">
          <h2 style="font-size: 20px; font-weight: bold; color: black;">
            Realizando sonhos sobre duas rodas!
          </h2>
        </div>

        <!-- Conteúdo -->
        <div style="space-y: 24px; font-size: 14px; line-height: 1.6;">
          <p style="text-align: justify; margin-bottom: 16px;">
            Na EzMotoFlow Veículos Motores, acreditamos que cada moto entregue representa muito mais que uma venda, é a 
            conquista de um sonho, o início de uma nova jornada e a confiança depositada em nosso trabalho.
          </p>

          <div style="margin: 32px 0;">
            <p><strong>Cliente:</strong> ${contract.client?.fullName || 'N/A'}</p>
            <p><strong>CPF:</strong> ${contract.client?.documento || 'N/A'}</p>
            <p><strong>Telefone:</strong> ${contract.client?.telefone || 'N/A'}</p>
            <p><strong>E-mail:</strong> ${contract.client?.email || 'N/A'}</p>
            
            <div style="margin: 24px 0; border-top: 1px solid #ccc; padding-top: 16px;">
              <p><strong>Modelo da Moto:</strong> ${contract.motorcycle?.nome || 'N/A'}</p>
              <p><strong>Placa:</strong> ${contract.motorcycle?.placa || 'N/A'}</p>
              <p><strong>Ano:</strong> ${contract.motorcycle?.ano || 'N/A'}</p>
              <p><strong>Chassi:</strong> ${contract.motorcycle?.chassi || 'N/A'}</p>
              <p><strong>RENAVAM:</strong> ${contract.motorcycle?.renavam || 'N/A'}</p>
            </div>

            <div style="margin: 24px 0; border-top: 1px solid #ccc; padding-top: 16px;">
              <p><strong>Valor do Contrato:</strong> R$ ${(contract.valor / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p><strong>Forma de Pagamento:</strong> ${contract.pagamento}</p>
              <p><strong>Data do Contrato:</strong> ${new Date(contract.data).toLocaleDateString('pt-BR')}</p>
              <p><strong>Status:</strong> ${contract.status}</p>
            </div>
          </div>

          <div style="text-align: center; margin: 32px 0;">
            <p style="font-size: 18px; font-weight: bold;">🎉 Parabéns pela sua conquista!</p>
          </div>

          <p style="text-align: justify; margin-bottom: 16px;">
            Hoje celebramos com você esse momento especial! Sua nova motocicleta simboliza esforço, determinação e a 
            busca por novos caminhos.
          </p>

          <p style="text-align: justify; margin-bottom: 16px;">
            Nos sentimos honrados e gratos por fazer parte dessa realização. Obrigado por escolher a EzMotoFlow Motores e 
            por acreditar em nossa equipe.
          </p>

          <div style="margin: 24px 0;">
            <p style="font-weight: bold;">Nossa parceria segue acelerando juntos!</p>
            <p style="text-align: justify;">
              Desejamos que cada quilômetro seja cheio de boas histórias, alegria, liberdade e segurança.
            </p>
          </div>

          <p style="text-align: justify; margin-bottom: 16px;">
            Agora você faz parte da família EzMotoFlow Motores e estaremos sempre prontos para te atender com a mesma 
            dedicação e carinho.
          </p>

          <p style="font-style: italic; margin-bottom: 32px;">
            Com gratidão, respeito e reconhecimento.
          </p>

          ${contract.observacao ? `
            <div style="margin: 32px 0; padding: 16px; background-color: #f9f9f9; border-left: 4px solid #2563eb;">
              <p style="font-weight: bold;">Observações:</p>
              <p style="font-size: 12px;">${contract.observacao}</p>
            </div>
          ` : ''}

          <!-- Termos e Condições -->
          <div style="margin: 48px 0; border-top: 1px solid #ccc; padding-top: 24px;">
            <h3 style="font-weight: bold; margin-bottom: 16px;">TERMOS E CONDIÇÕES:</h3>
            <div style="font-size: 12px; line-height: 1.4;">
              <p>1. Este contrato é válido mediante o pagamento integral do valor acordado.</p>
              <p>2. A entrega do veículo será realizada após a compensação do pagamento.</p>
              <p>3. O cliente se responsabiliza pela documentação e transferência do veículo.</p>
              <p>4. Garantia conforme especificações do fabricante.</p>
              <p>5. Foro competente: comarca de São Paulo/SP.</p>
            </div>
          </div>

          <!-- Assinaturas -->
          <div style="margin: 48px 0;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
              <div style="text-align: center;">
                <div style="height: 80px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center;">
                  <img src="${signatureDataURL}" alt="Assinatura do Cliente" style="max-width: 100%; max-height: 80px;" />
                </div>
                <div style="border-top: 1px solid #999; padding-top: 8px;">
                  <p style="font-size: 12px; font-weight: bold;">CLIENTE</p>
                  <p style="font-size: 12px;">${contract.client?.fullName}</p>
                  <p style="font-size: 12px;">CPF: ${contract.client?.documento}</p>
                  <p style="font-size: 10px; color: #666; margin-top: 4px;">
                    Assinado em: ${new Date().toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
              <div style="text-align: center;">
                <div style="border-top: 1px solid #999; padding-top: 8px; margin-top: 96px;">
                  <p style="font-size: 12px; font-weight: bold;">EZMOTOFLOW VEÍCULOS MOTORES</p>
                  <p style="font-size: 12px;">Representante Legal</p>
                  <p style="font-size: 12px;">CNPJ: 12.345.678/0001-90</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(tempDiv);

    try {
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      const pdfWidth = 210;
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      const pdfBase64 = pdf.output('datauristring');
      
      return pdfBase64;
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  const handleSign = async () => {
    if (sigPad.current?.isEmpty()) {
      toast.error('Por favor, faça sua assinatura');
      return;
    }

    try {
      const signatureDataURL = sigPad.current?.toDataURL();
      
      // Gerar PDF do contrato assinado
      const contractPdfBase64 = await generateContractPDF(signatureDataURL);

      signContract({
        signature: signatureDataURL,
        signedAt: new Date().toISOString(),
        signerName: contract?.client?.fullName,
        contractPdf: contractPdfBase64
      });
    } catch (error) {
      toast.error('Erro ao gerar PDF do contrato');
      console.error('Erro ao gerar PDF:', error);
    }
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