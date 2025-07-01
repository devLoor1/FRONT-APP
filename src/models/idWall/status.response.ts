export type StatusResponse = {
  status: 'Pendente' | 'PreProcessando' | 'Processando' | 'EmAnalise' | 'Concluido' | 'Inexistente';
  resultado?: 'Valido' | 'AprovadoManualmente' | 'Invalido' | 'ReprovadoManualmente';
};
