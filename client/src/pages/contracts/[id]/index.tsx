"use client"

import { Subtitle } from '@/components/ui/Subtitle';
import { FileText, ArrowLeft, AlertTriangle } from 'lucide-react';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { PermissionResource, PermissionAction } from '@/types/permissions';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Title } from '@/components/ui/Title';
import Assinatura from "/assinatura.png"
import { motion } from 'framer-motion';
import { Contract } from '@/types';
import { useEffect } from 'react';
import api from '@/lib/api';

export default function ViewContractPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();


  const { data: contract, isLoading } = useQuery<Contract>({
    queryKey: ['contract-detail', id],
    queryFn: async () => {
      const { data } = await api.get<Contract>(`/contract/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const handlePrint = () => {
    const printStyles = document.createElement('style');
    printStyles.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        #contract-document, #contract-document * {
          visibility: visible;
        }
        #contract-document {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .print\\:hidden {
          display: none !important;
        }
        @page {
          margin: 1cm;
          size: A4;
        }
      }
    `;

    document.head.appendChild(printStyles);

    window.print();

    setTimeout(() => {
      document.head.removeChild(printStyles);
    }, 1000);
  };

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
    <PermissionGuard
      resource={PermissionResource.CONTRACTS}
      action={PermissionAction.READ}
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <div className="text-center">
            <Title size="xl" className="text-foreground mb-2">
              Acesso Negado
            </Title>
            <Subtitle className="text-muted-foreground">
              Você não tem permissão para visualizar contratos
            </Subtitle>
          </div>
          <Link to="/contracts">
            <Button testID="back-to-contracts" type="secondary">Voltar para Contratos</Button>
          </Link>
        </div>
      }
    >
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
              Contrato de Venda
            </Title>
            <Subtitle className="text-muted-foreground">
              Visualização do documento de contrato
            </Subtitle>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          id="contract-document"
          className="bg-white shadow-xl border border-gray-200 mx-auto print:shadow-none"
          style={{ minHeight: '297mm', width: '210mm', maxWidth: '100%' }}
        >
          <div className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-blue-600 mb-2">EzMotoFlow</h1>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 text-center">
            <h2 className="text-xl font-bold text-black">
              Realizando sonhos sobre duas rodas!
            </h2>
            <div className="w-full h-0.5 bg-black mt-4"></div>
          </div>

          <div className="px-8 py-6 space-y-6 text-sm leading-relaxed text-black">
            <p className="text-justify text-black">
              Na EzMotoFlow Veículos Motores, acreditamos que cada moto entregue representa muito mais que uma venda, é a
              conquista de um sonho, o início de uma nova jornada e a confiança depositada em nosso trabalho.
            </p>

            <div className="my-8 space-y-2 text-black">
              <p className="text-black"><strong className="text-black">Cliente:</strong> {contract.client?.fullName || 'N/A'}</p>
              <p className="text-black"><strong className="text-black">CPF:</strong> {contract.client?.documento || 'N/A'}</p>
              <p className="text-black"><strong className="text-black">Telefone:</strong> {contract.client?.telefone || 'N/A'}</p>
              <p className="text-black"><strong className="text-black">E-mail:</strong> {contract.client?.email || 'N/A'}</p>

              <div className="my-6 border-t border-gray-300 pt-4">
                <p className="text-black"><strong className="text-black">Modelo da Moto:</strong> {contract.motorcycle?.nome || 'N/A'}</p>
                <p className="text-black"><strong className="text-black">Placa:</strong> {contract.motorcycle?.placa || 'N/A'}</p>
                <p className="text-black"><strong className="text-black">Ano:</strong> {contract.motorcycle?.ano || 'N/A'}</p>
                <p className="text-black"><strong className="text-black">Chassi:</strong> {contract.motorcycle?.chassi || 'N/A'}</p>
                <p className="text-black"><strong className="text-black">RENAVAM:</strong> {contract.motorcycle?.renavam || 'N/A'}</p>
              </div>

              <div className="my-6 border-t border-gray-300 pt-4">
                <p className="text-black"><strong className="text-black">Valor do Contrato:</strong> R$ {(contract.valor / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-black"><strong className="text-black">Forma de Pagamento:</strong> {contract.pagamento}</p>
                <p className="text-black"><strong className="text-black">Data do Contrato:</strong> {new Date(contract.data).toLocaleDateString('pt-BR')}</p>
                <p className="text-black"><strong className="text-black">Status:</strong> <span className="uppercase font-semibold text-black">{contract.status}</span></p>
              </div>
            </div>

            <div className="text-center my-8">
              <p className="text-lg font-semibold text-black">🎉 Parabéns pela sua conquista!</p>
            </div>

            <p className="text-justify text-black">
              Hoje celebramos com você esse momento especial! Sua nova motocicleta simboliza esforço, determinação e a
              busca por novos caminhos.
            </p>

            <p className="text-justify text-black">
              Nos sentimos honrados e gratos por fazer parte dessa realização. Obrigado por escolher a EzMotoFlow Motores e
              por acreditar em nossa equipe.
            </p>

            <div className="my-6">
              <p className="font-semibold text-black">Nossa parceria segue acelerando juntos!</p>
              <p className="text-justify text-black">
                Desejamos que cada quilômetro seja cheio de boas histórias, alegria, liberdade e segurança.
              </p>
            </div>

            <p className="text-justify text-black">
              Agora você faz parte da família EzMotoFlow Motores e estaremos sempre prontos para te atender com a mesma
              dedicação e carinho.
            </p>

            <p className="italic text-black">
              Com gratidão, respeito e reconhecimento.
            </p>

            {contract.observacao && (
              <div className="mt-8 p-4 bg-gray-50 border-l-4 border-blue-500">
                <p className="font-semibold text-black">Observações:</p>
                <p className="text-sm text-black">{contract.observacao}</p>
              </div>
            )}

            <div className="mt-12 pt-6 border-t border-gray-300">
              <h3 className="font-semibold mb-4 text-black">TERMOS E CONDIÇÕES:</h3>
              <div className="space-y-2 text-xs text-black">
                <p className="text-black">1. Este contrato é válido mediante o pagamento integral do valor acordado.</p>
                <p className="text-black">2. A entrega do veículo será realizada após a compensação do pagamento.</p>
                <p className="text-black">3. O cliente se responsabiliza pela documentação e transferência do veículo.</p>
                <p className="text-black">4. Garantia conforme especificações do fabricante.</p>
                <p className="text-black">5. Foro competente: comarca de São Paulo/SP.</p>
              </div>
            </div>

            <div className="mt-12 pt-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="pt-2 mt-16">
                    {contract.status === 'finalizado' && contract.signatures?.signature ? (
                      <div className="mb-4">
                        <img
                          src={contract.signatures.signature}
                          alt="Assinatura do Cliente"
                          className="max-w-full h-20 mx-auto object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-20 mb-4"></div>
                    )}
                    <div className="border-t border-gray-400 pt-2">
                      <p className="text-xs font-semibold text-black">CLIENTE</p>
                      <p className="text-xs text-black">{contract.client?.fullName}</p>
                      <p className="text-xs text-black">CPF: {contract.client?.documento}</p>
                      {contract.status === 'finalizado' && contract.signatures?.signedAt && (
                        <p className="text-xs text-gray-600 mt-1">
                          Assinado em: {new Date(contract.signatures.signedAt).toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="pt-2 mt-16">
                    <div className="mb-4">
                      <img
                        src={Assinatura}
                        alt="Assinatura do Representante Legal"
                        className="max-w-full h-20 mx-auto object-contain"
                      />
                    </div>
                  </div>
                  <div className="border-t border-gray-400 pt-2">
                    <p className="text-xs font-semibold text-black">EZMOTOFLOW VEÍCULOS MOTORES</p>
                    <p className="text-xs text-black">Representante Legal</p>
                    <p className="text-xs text-black">CNPJ: 12.345.678/0001-90</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center items-center gap-4 print:hidden"
        >
          <Button
            testID="print-button"
            type="primary"
            onClick={handlePrint}
            className="shadow-primary"
          >
            <FileText className="w-5 h-5 mr-2" />
            Imprimir Contrato
          </Button>

          <Link to="/contracts">
            <Button testID="back-list-button" type="secondary">
              Voltar para Lista
            </Button>
          </Link>
        </motion.div>
      </div>
    </PermissionGuard>
  );
}
