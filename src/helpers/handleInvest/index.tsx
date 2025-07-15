import { OpportunitiesResponse } from '@/models/opportunities/opportunities.response';
import { UserType } from '@/models-old/types/User';

type Props = {
  user: UserType | null;
  opportunity: OpportunitiesResponse[0];
};

export default function handleInvest({ user, opportunity }: Props): {
  msg?: string;
  error: boolean;
} {
  const maxQuota = opportunity.qtdTotalCotas / 2;

  if (user) {
    if (opportunity.qtdCotasInvestidas >= maxQuota) {
      return {
        msg: `Você atingiu o limite de ${maxQuota} cotas, veja outras oportunidades e invista!`,
        error: true,
      };
    } else if ((user.balanceTot || 0) < opportunity.valorCota) {
      return {
        msg: `Saldo insuficiente para essa oportunidade, veja outras oportunidades e invista!`,
        error: true,
      };
    } else {
      return {
        error: false,
      };
    }
  }

  return {
    error: false,
  };
}
