import { NbMenuItem } from '@nebular/theme';

export const OHB_CMS_MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/panel',
    home: true,
  },
  {
    title: 'Streaming',
    icon: 'film-outline',
    link: '/panel/streaming',
  },
  {
    title: 'Banners',
    icon: 'image-outline',
    children: [
      {
        title: 'Home',
        icon: 'home-outline',
        link: '/panel/banners/home',
      },
      {
        title: 'Casino',
      },
    ],
  },
  {
    title: 'Pages',
    icon: 'browser-outline',
    children: [
      {
        title: 'Language',
        children: [
          {
            title: 'Home',
          },
          {
            title: 'Casino',
          },
        ],
      },
      {
        title: 'Modals',
      },
    ],
  },
  {
    title: 'Payments',
    icon: 'credit-card-outline',
    children: [
      {
        title: 'Providers',
        link: '/panel/payments/providers',
      },
      {
        title: 'ProviderChannels',
        link: '/panel/payments/provider-channels',
      },
      {
        title: 'ProviderCards',
        link: '/panel/payments/provider-cards',
      },
      {
        title: 'ProviderBanks',
        link: '/panel/payments/provider-banks',
      },
      {
        title: 'DepositOrders',
        link: '/panel/payments/deposit-orders',
        // badge: {
        //   text: '99+',
        //   status: 'danger',
        // },
      },
      {
        title: 'WithdrawOrders',
        link: '/panel/payments/withdraw-orders',
      },
      // {
      //   title: 'Transaction history',
      //   link: '/panel/payments/transaction-history',
      // },
      {
        title: 'Reports',
        link: '/panel/payments/reports',
      },
    ],
  },
  {
    title: 'Options',
    link: '/panel/options',
    icon: 'settings-outline',
  },
];
