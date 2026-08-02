export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}
