const CommonClears = {
  clearCPF(cpf: string) {
    return cpf.replace('.', '').replace('.', '').replace('-', '');
  },
  clearPhone(phone: string) {
    return phone.replace('(', '').replace(')', '').replace(' ', '').replace('-', '');
  },
  clearCEP(cep: string) {
    return cep.replace('-', '');
  },
  clearCNPJ(cnpj: string) {
    return cnpj.replace('.', '').replace('.', '').replace('-', '').replace('/', '');
  },
};

export default CommonClears;
