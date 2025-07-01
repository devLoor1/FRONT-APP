export default function InvestimentStatus(idStatus: number) {
  let status = '';

  switch (idStatus) {
    case 100:
      status = 'Em processamento';
      break;
    case 300:
      status = 'Não processado';
      break;
    case 1000:
      status = 'Aguardando';
      break;
    case 2000:
      status = 'Captação';
      break;
    case 2500:
      status = 'Assinatura';
      break;
    case 3000:
      status = 'Em dia';
      break;
    case 4000:
      status = 'Em Atraso';
      break;
    case 5900:
      status = 'Aguardando Estorno';
      break;
    case 6000:
      status = 'Cancelado';
      break;
    default:
      status = 'Finalizado';
      break;
  }

  return status;
}
