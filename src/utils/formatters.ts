/**
 * Utilitários para formatação de dados
 */

/**
 * Formata telefone brasileiro para formato internacional
 * @param phone - Telefone em qualquer formato brasileiro
 * @returns Telefone formatado como +55XXXXXXXXXXX
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return phone;
  // Remove todos os caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  // Adiciona prefixo +55
  return `+55${cleanPhone}`;
};

/**
 * Formata tipo de pessoa para formato da API
 * @param type - Tipo de pessoa (Pessoa Física ou Pessoa Jurídica)
 * @returns Tipo formatado (pessoa_fisica ou pessoa_juridica)
 */
export const formatPersonType = (type: string): string => {
  return type === 'Pessoa Física' ? 'pessoa_fisica' : 'pessoa_juridica';
};

/**
 * Formata CPF removendo caracteres especiais
 * @param cpf - CPF em qualquer formato
 * @returns CPF apenas com números
 */
export const formatCPF = (cpf: string): string => {
  if (!cpf) return cpf;
  return cpf.replace(/\D/g, '');
};

/**
 * Formata CEP removendo caracteres especiais
 * @param cep - CEP em qualquer formato
 * @returns CEP apenas com números
 */
export const formatCEP = (cep: string): string => {
  if (!cep) return cep;
  return cep.replace(/\D/g, '');
}; 