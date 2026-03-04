import { AxiosError } from 'axios';

const errorMessages: Record<string, string> = {
  // Documento/CPF/CNPJ
  'Document is already registered.': 'CPF/CNPJ já cadastrado.',

  // Email
  'Email is already registered.': 'E-mail já cadastrado.',
  'A user with this email address is already registered.': 'Já existe um usuário com este e-mail.',

  // Placa
  'Plate is already registered.': 'Placa já cadastrada.',

  // Chassi
  'Chassi is already registered.': 'Chassi já cadastrado.',

  // Renavam
  'Renavam is already registered.': 'Renavam já cadastrado.',

  // Motocicleta vendida
  'Cannot update a sold motorcycle': 'Não é possível editar uma motocicleta vendida.',

  // Não encontrado
  'User not found': 'Usuário não encontrado.',
  'Clients not found': 'Cliente não encontrado.',
  'Motorcycle not found': 'Motocicleta não encontrada.',
  'Contract not found': 'Contrato não encontrado.',

  // Genéricas
  'Failed to create user': 'Erro ao criar usuário.',
  'Error creating motorcycle': 'Erro ao criar motocicleta.',
  'Error updating motorcycle': 'Erro ao atualizar motocicleta.',
  'Error updating clients': 'Erro ao atualizar cliente.',
  'Unauthorized': 'Não autorizado.',
  'Forbidden': 'Acesso negado.',
};

export function getErrorMessage(error: any): string {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;

    const errorText = Array.isArray(message) ? message[0] : message;

    if (errorText && errorMessages[errorText]) {
      return errorMessages[errorText];
    }

    if (errorText) {
      return errorText;
    }

    switch (error.response?.status) {
      case 400:
        return 'Dados inválidos. Verifique as informações e tente novamente.';
      case 401:
        return 'Não autorizado. Faça login novamente.';
      case 403:
        return 'Você não tem permissão para realizar esta ação.';
      case 404:
        return 'Recurso não encontrado.';
      case 409:
        return 'Conflito: já existe um registro com esses dados.';
      case 500:
        return 'Erro interno do servidor. Tente novamente mais tarde.';
      default:
        return 'Erro ao processar a solicitação.';
    }
  }

  return 'Erro desconhecido.';
}
