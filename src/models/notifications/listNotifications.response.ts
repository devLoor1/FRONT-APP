export type ListNotificationsResponse = {
  idNotification: number;
  title: string;
  message: string;
  isRead: boolean;
  created: string;
  idOpportunity?: number;
}[];
