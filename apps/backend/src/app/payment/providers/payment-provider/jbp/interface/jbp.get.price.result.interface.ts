export interface JBPGetPriceResult {
  code: number;
  msg: string;
  data: {
    coinType: string;
    buyPrice: number;
    sellPrice: number;
  };
  success: boolean;
}
