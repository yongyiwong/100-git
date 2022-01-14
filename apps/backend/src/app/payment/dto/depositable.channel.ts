export class DepositableChannel {
  channelId: number;
  isAvailable: boolean;
  channelName: string;
  minAmount: number;
  maxAmount: number;
  locales: {
    [key: string]: string;
  };
}
