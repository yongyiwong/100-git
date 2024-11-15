'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    await queryInterface.bulkInsert(
      'paymentProviderBank',
      [
        {
          id: 1,
          paymentProviderId: 1,
          bankId: 1,
          paymentProviderBankCode: 'ICBC',
          paymentProviderBankName: '中国工商银行',
          isAvailable: true,
        },
        {
          id: 2,
          paymentProviderId: 1,
          bankId: 2,
          paymentProviderBankCode: 'ABC',
          paymentProviderBankName: '中国农业银行',
          isAvailable: true,
        },
        {
          id: 3,
          paymentProviderId: 1,
          bankId: 3,
          paymentProviderBankCode: 'BOC',
          paymentProviderBankName: '中国银行',
          isAvailable: true,
        },
        {
          id: 4,
          paymentProviderId: 1,
          bankId: 4,
          paymentProviderBankCode: 'CCBC',
          paymentProviderBankName: '中国建设银行',
          isAvailable: true,
        },
        {
          id: 5,
          paymentProviderId: 1,
          bankId: 5,
          paymentProviderBankCode: 'BOCOM',
          paymentProviderBankName: '交通银行',
          isAvailable: true,
        },
        {
          id: 6,
          paymentProviderId: 1,
          bankId: 6,
          paymentProviderBankCode: 'PSBC',
          paymentProviderBankName: '中国邮政储蓄银行',
          isAvailable: true,
        },
        {
          id: 7,
          paymentProviderId: 1,
          bankId: 7,
          paymentProviderBankCode: 'CEB',
          paymentProviderBankName: '中国光大银行',
          isAvailable: true,
        },
        {
          id: 8,
          paymentProviderId: 1,
          bankId: 8,
          paymentProviderBankCode: 'CMBC',
          paymentProviderBankName: '中国民生银行',
          isAvailable: true,
        },
        {
          id: 9,
          paymentProviderId: 1,
          bankId: 9,
          paymentProviderBankCode: 'CMB',
          paymentProviderBankName: '招商银行',
          isAvailable: true,
        },
        {
          id: 10,
          paymentProviderId: 1,
          bankId: 10,
          paymentProviderBankCode: 'ECITIC',
          paymentProviderBankName: '中信银行',
          isAvailable: true,
        },
        {
          id: 11,
          paymentProviderId: 1,
          bankId: 11,
          paymentProviderBankCode: 'HXB',
          paymentProviderBankName: '华夏银行',
          isAvailable: true,
        },
        {
          id: 12,
          paymentProviderId: 1,
          bankId: 12,
          paymentProviderBankCode: 'SPDB',
          paymentProviderBankName: '上海浦东发展银行',
          isAvailable: true,
        },
        {
          id: 13,
          paymentProviderId: 1,
          bankId: 13,
          paymentProviderBankCode: 'PAB',
          paymentProviderBankName: '平安银行',
          isAvailable: true,
        },
        {
          id: 14,
          paymentProviderId: 1,
          bankId: 14,
          paymentProviderBankCode: 'CGB',
          paymentProviderBankName: '广发银行',
          isAvailable: true,
        },
        {
          id: 15,
          paymentProviderId: 1,
          bankId: 15,
          paymentProviderBankCode: 'CIB',
          paymentProviderBankName: '兴业银行',
          isAvailable: true,
        },
        {
          id: 16,
          paymentProviderId: 1,
          bankId: 16,
          paymentProviderBankCode: 'BOB',
          paymentProviderBankName: '北京银行',
          isAvailable: true,
        },
        {
          id: 17,
          paymentProviderId: 1,
          bankId: 17,
          paymentProviderBankCode: 'BOS',
          paymentProviderBankName: '上海银行',
          isAvailable: true,
        },
        {
          id: 18,
          paymentProviderId: 1,
          bankId: 18,
          paymentProviderBankCode: 'NBCB',
          paymentProviderBankName: '宁波银行',
          isAvailable: true,
        },
        {
          id: 19,
          paymentProviderId: 3,
          bankId: 9,
          paymentProviderBankCode: 'CMB',
          paymentProviderBankName: '招商银行',
          isAvailable: true,
        },
        {
          id: 20,
          paymentProviderId: 3,
          bankId: 1,
          paymentProviderBankCode: 'ICBC',
          paymentProviderBankName: '中国工商银行',
          isAvailable: true,
        },
        {
          id: 21,
          paymentProviderId: 3,
          bankId: 4,
          paymentProviderBankCode: 'CCB',
          paymentProviderBankName: '中国建设银行',
          isAvailable: true,
        },
        {
          id: 22,
          paymentProviderId: 3,
          bankId: 3,
          paymentProviderBankCode: 'BOC',
          paymentProviderBankName: '中国银行',
          isAvailable: true,
        },
        {
          id: 23,
          paymentProviderId: 3,
          bankId: 2,
          paymentProviderBankCode: 'ABOC',
          paymentProviderBankName: '中国农业银行',
          isAvailable: true,
        },
        {
          id: 24,
          paymentProviderId: 3,
          bankId: 5,
          paymentProviderBankCode: 'BOCOM',
          paymentProviderBankName: '交通银行',
          isAvailable: true,
        },
        {
          id: 25,
          paymentProviderId: 3,
          bankId: 12,
          paymentProviderBankCode: 'SPDB',
          paymentProviderBankName: '浦发银行',
          isAvailable: true,
        },
        {
          id: 26,
          paymentProviderId: 3,
          bankId: 14,
          paymentProviderBankCode: 'CGB',
          paymentProviderBankName: '广发银行',
          isAvailable: true,
        },
        {
          id: 27,
          paymentProviderId: 3,
          bankId: 10,
          paymentProviderBankCode: 'ECITIC',
          paymentProviderBankName: '中信银行',
          isAvailable: true,
        },
        {
          id: 28,
          paymentProviderId: 3,
          bankId: 7,
          paymentProviderBankCode: 'CEB',
          paymentProviderBankName: '中国光大银行',
          isAvailable: true,
        },
        {
          id: 29,
          paymentProviderId: 3,
          bankId: 15,
          paymentProviderBankCode: 'CIB',
          paymentProviderBankName: '兴业银行',
          isAvailable: true,
        },
        {
          id: 30,
          paymentProviderId: 3,
          bankId: 13,
          paymentProviderBankCode: 'SDB',
          paymentProviderBankName: '平安银行',
          isAvailable: true,
        },
        {
          id: 31,
          paymentProviderId: 3,
          bankId: 8,
          paymentProviderBankCode: 'CMBC',
          paymentProviderBankName: '民生银行',
          isAvailable: true,
        },
        {
          id: 32,
          paymentProviderId: 3,
          bankId: 11,
          paymentProviderBankCode: 'HXB',
          paymentProviderBankName: '华夏银行',
          isAvailable: true,
        },
        {
          id: 33,
          paymentProviderId: 3,
          bankId: 6,
          paymentProviderBankCode: 'PSBC',
          paymentProviderBankName: '中国邮政银行',
          isAvailable: true,
        },
        {
          id: 34,
          paymentProviderId: 3,
          bankId: 16,
          paymentProviderBankCode: 'BOBJ',
          paymentProviderBankName: '北京银行',
          isAvailable: true,
        },
        {
          id: 35,
          paymentProviderId: 3,
          bankId: 17,
          paymentProviderBankCode: 'BOS',
          paymentProviderBankName: '上海银行',
          isAvailable: true,
        },
        {
          id: 36,
          paymentProviderId: 3,
          bankId: 19,
          paymentProviderBankCode: 'HZB',
          paymentProviderBankName: '杭州银行',
          isAvailable: true,
        },
        {
          id: 37,
          paymentProviderId: 3,
          bankId: 20,
          paymentProviderBankCode: 'BJRCB',
          paymentProviderBankName: '北京农商银行',
          isAvailable: true,
        },
        {
          id: 38,
          paymentProviderId: 2,
          bankId: 7,
          paymentProviderBankCode: 'CEB',
          paymentProviderBankName: '光大银行',
          isAvailable: true,
        },
        {
          id: 39,
          paymentProviderId: 2,
          bankId: 8,
          paymentProviderBankCode: 'CMBC',
          paymentProviderBankName: '民生银行',
          isAvailable: true,
        },
        {
          id: 40,
          paymentProviderId: 2,
          bankId: 15,
          paymentProviderBankCode: 'CIB',
          paymentProviderBankName: '兴业银行',
          isAvailable: true,
        },
        {
          id: 41,
          paymentProviderId: 2,
          bankId: 10,
          paymentProviderBankCode: 'ECITIC',
          paymentProviderBankName: '中信银行',
          isAvailable: true,
        },
        {
          id: 42,
          paymentProviderId: 2,
          bankId: 14,
          paymentProviderBankCode: 'GDB',
          paymentProviderBankName: '广发银行',
          isAvailable: true,
        },
        {
          id: 43,
          paymentProviderId: 2,
          bankId: 12,
          paymentProviderBankCode: 'SPDB',
          paymentProviderBankName: '浦发银行',
          isAvailable: true,
        },
        {
          id: 44,
          paymentProviderId: 2,
          bankId: 13,
          paymentProviderBankCode: 'PINGAN',
          paymentProviderBankName: '平安银行',
          isAvailable: true,
        },
        {
          id: 45,
          paymentProviderId: 2,
          bankId: 6,
          paymentProviderBankCode: 'PSBC',
          paymentProviderBankName: '邮政储蓄银行',
          isAvailable: true,
        },
        {
          id: 46,
          paymentProviderId: 2,
          bankId: 17,
          paymentProviderBankCode: 'BOS',
          paymentProviderBankName: '上海银行',
          isAvailable: true,
        },
        {
          id: 47,
          paymentProviderId: 2,
          bankId: 16,
          paymentProviderBankCode: 'BCCB',
          paymentProviderBankName: '北京银行',
          isAvailable: true,
        },
        {
          id: 48,
          paymentProviderId: 2,
          bankId: 1,
          paymentProviderBankCode: 'ICBC',
          paymentProviderBankName: '工商银行',
          isAvailable: true,
        },
        {
          id: 49,
          paymentProviderId: 2,
          bankId: 4,
          paymentProviderBankCode: 'CCB',
          paymentProviderBankName: '建设银行',
          isAvailable: true,
        },
        {
          id: 50,
          paymentProviderId: 2,
          bankId: 2,
          paymentProviderBankCode: 'ABC',
          paymentProviderBankName: '农业银行',
          isAvailable: true,
        },
        {
          id: 51,
          paymentProviderId: 2,
          bankId: 9,
          paymentProviderBankCode: 'CMB',
          paymentProviderBankName: '招商银行',
          isAvailable: true,
        },
        {
          id: 52,
          paymentProviderId: 2,
          bankId: 5,
          paymentProviderBankCode: 'BOCO',
          paymentProviderBankName: '交通银行',
          isAvailable: true,
        },
        {
          id: 53,
          paymentProviderId: 2,
          bankId: 3,
          paymentProviderBankCode: 'BOC',
          paymentProviderBankName: '中国银行',
          isAvailable: true,
        },
        {
          id: 54,
          paymentProviderId: 4,
          bankId: 1,
          paymentProviderBankCode: '中国工商银行',
          paymentProviderBankName: '中国工商银行',
          isAvailable: true,
        },
        {
          id: 55,
          paymentProviderId: 4,
          bankId: 2,
          paymentProviderBankCode: '农业银行',
          paymentProviderBankName: '农业银行',
          isAvailable: true,
        },
        {
          id: 56,
          paymentProviderId: 4,
          bankId: 4,
          paymentProviderBankCode: '建设银行',
          paymentProviderBankName: '建设银行',
          isAvailable: true,
        },
        {
          id: 57,
          paymentProviderId: 4,
          bankId: 12,
          paymentProviderBankCode: '上海浦东发展银行',
          paymentProviderBankName: '上海浦东发展银行',
          isAvailable: true,
        },
        {
          id: 58,
          paymentProviderId: 4,
          bankId: 15,
          paymentProviderBankCode: '兴业银行',
          paymentProviderBankName: '兴业银行',
          isAvailable: true,
        },
        {
          id: 59,
          paymentProviderId: 4,
          bankId: 8,
          paymentProviderBankCode: '民生银行',
          paymentProviderBankName: '民生银行',
          isAvailable: true,
        },
        {
          id: 60,
          paymentProviderId: 4,
          bankId: 5,
          paymentProviderBankCode: '交通银行',
          paymentProviderBankName: '交通银行',
          isAvailable: true,
        },
        {
          id: 61,
          paymentProviderId: 4,
          bankId: 10,
          paymentProviderBankCode: '中信银行',
          paymentProviderBankName: '中信银行',
          isAvailable: true,
        },
        {
          id: 62,
          paymentProviderId: 4,
          bankId: 7,
          paymentProviderBankCode: '中国光大银行',
          paymentProviderBankName: '中国光大银行',
          isAvailable: true,
        },
        {
          id: 63,
          paymentProviderId: 4,
          bankId: 9,
          paymentProviderBankCode: '招商银行',
          paymentProviderBankName: '招商银行',
          isAvailable: true,
        },
        {
          id: 64,
          paymentProviderId: 4,
          bankId: 14,
          paymentProviderBankCode: '广发银行',
          paymentProviderBankName: '广发银行',
          isAvailable: true,
        },
        {
          id: 65,
          paymentProviderId: 4,
          bankId: 3,
          paymentProviderBankCode: '中国银行',
          paymentProviderBankName: '中国银行',
          isAvailable: true,
        },
        {
          id: 66,
          paymentProviderId: 4,
          bankId: 11,
          paymentProviderBankCode: '华夏银行',
          paymentProviderBankName: '华夏银行',
          isAvailable: true,
        },
        {
          id: 67,
          paymentProviderId: 4,
          bankId: 13,
          paymentProviderBankCode: '平安银行',
          paymentProviderBankName: '平安银行',
          isAvailable: true,
        },
        {
          id: 68,
          paymentProviderId: 4,
          bankId: 6,
          paymentProviderBankCode: '中国邮政',
          paymentProviderBankName: '中国邮政',
          isAvailable: true,
        },
        {
          id: 69,
          paymentProviderId: 4,
          bankId: 16,
          paymentProviderBankCode: '北京银行',
          paymentProviderBankName: '北京银行',
          isAvailable: true,
        },
        {
          id: 70,
          paymentProviderId: 4,
          bankId: 17,
          paymentProviderBankCode: '上海银行',
          paymentProviderBankName: '上海银行',
          isAvailable: true,
        },
        {
          id: 71,
          paymentProviderId: 4,
          bankId: 21,
          paymentProviderBankCode: '哈尔滨银行',
          paymentProviderBankName: '哈尔滨银行',
          isAvailable: true,
        },
        {
          id: 72,
          paymentProviderId: 4,
          bankId: 22,
          paymentProviderBankCode: '浙商银行',
          paymentProviderBankName: '浙商银行',
          isAvailable: true,
        },
        {
          id: 73,
          paymentProviderId: 4,
          bankId: 23,
          paymentProviderBankCode: '长沙银行',
          paymentProviderBankName: '长沙银行',
          isAvailable: true,
        },
        {
          id: 74,
          paymentProviderId: 4,
          bankId: 24,
          paymentProviderBankCode: '青岛银行',
          paymentProviderBankName: '青岛银行',
          isAvailable: true,
        },
        {
          id: 75,
          paymentProviderId: 6,
          bankId: 1,
          paymentProviderBankCode: 'ICBC',
          paymentProviderBankName: '工商银行',
          isAvailable: true,
        },
        {
          id: 76,
          paymentProviderId: 6,
          bankId: 4,
          paymentProviderBankCode: 'CCB',
          paymentProviderBankName: '建设银行',
          isAvailable: true,
        },
        {
          id: 77,
          paymentProviderId: 6,
          bankId: 2,
          paymentProviderBankCode: 'ABC',
          paymentProviderBankName: '农业银行',
          isAvailable: true,
        },
        {
          id: 78,
          paymentProviderId: 6,
          bankId: 6,
          paymentProviderBankCode: 'PSBS',
          paymentProviderBankName: '邮政储蓄银行',
          isAvailable: true,
        },
        {
          id: 79,
          paymentProviderId: 6,
          bankId: 3,
          paymentProviderBankCode: 'BOC',
          paymentProviderBankName: '中国银行',
          isAvailable: true,
        },
        {
          id: 80,
          paymentProviderId: 6,
          bankId: 5,
          paymentProviderBankCode: 'BOCO',
          paymentProviderBankName: '交通银行',
          isAvailable: true,
        },
        {
          id: 81,
          paymentProviderId: 6,
          bankId: 9,
          paymentProviderBankCode: 'CMB',
          paymentProviderBankName: '招商银行',
          isAvailable: true,
        },
        {
          id: 82,
          paymentProviderId: 6,
          bankId: 7,
          paymentProviderBankCode: 'CEB',
          paymentProviderBankName: '光大银行',
          isAvailable: true,
        },
        {
          id: 83,
          paymentProviderId: 6,
          bankId: 15,
          paymentProviderBankCode: 'CIB',
          paymentProviderBankName: '兴业银行',
          isAvailable: true,
        },
        {
          id: 84,
          paymentProviderId: 6,
          bankId: 8,
          paymentProviderBankCode: 'CMBC',
          paymentProviderBankName: '民生银行',
          isAvailable: true,
        },
        {
          id: 85,
          paymentProviderId: 6,
          bankId: 16,
          paymentProviderBankCode: 'BCCB',
          paymentProviderBankName: '北京银行',
          isAvailable: true,
        },
        {
          id: 86,
          paymentProviderId: 6,
          bankId: 10,
          paymentProviderBankCode: 'CTTIC',
          paymentProviderBankName: '中信银行',
          isAvailable: true,
        },
        {
          id: 87,
          paymentProviderId: 6,
          bankId: 14,
          paymentProviderBankCode: 'GDB',
          paymentProviderBankName: '广东发展银行',
          isAvailable: true,
        },
        {
          id: 88,
          paymentProviderId: 6,
          bankId: 25,
          paymentProviderBankCode: 'SDB',
          paymentProviderBankName: '深圳发展银行',
          isAvailable: true,
        },
        {
          id: 89,
          paymentProviderId: 6,
          bankId: 12,
          paymentProviderBankCode: 'SPDB',
          paymentProviderBankName: '浦东发展银行',
          isAvailable: true,
        },
        {
          id: 90,
          paymentProviderId: 6,
          bankId: 13,
          paymentProviderBankCode: 'PINGANBANK',
          paymentProviderBankName: '平安银行',
          isAvailable: true,
        },
        {
          id: 91,
          paymentProviderId: 6,
          bankId: 11,
          paymentProviderBankCode: 'HXB',
          paymentProviderBankName: '华夏银行',
          isAvailable: true,
        },
        {
          id: 92,
          paymentProviderId: 6,
          bankId: 17,
          paymentProviderBankCode: 'SHB',
          paymentProviderBankName: '上海银行',
          isAvailable: true,
        },
        {
          id: 93,
          paymentProviderId: 6,
          bankId: 26,
          paymentProviderBankCode: 'CBHB',
          paymentProviderBankName: '渤海银行',
          isAvailable: true,
        },
        {
          id: 94,
          paymentProviderId: 6,
          bankId: 27,
          paymentProviderBankCode: 'HKBEA',
          paymentProviderBankName: '东亚银行',
          isAvailable: true,
        },
        {
          id: 95,
          paymentProviderId: 6,
          bankId: 18,
          paymentProviderBankCode: 'NBCB',
          paymentProviderBankName: '宁波银行',
          isAvailable: true,
        },
        {
          id: 96,
          paymentProviderId: 6,
          bankId: 22,
          paymentProviderBankCode: 'CZB',
          paymentProviderBankName: '浙商银行',
          isAvailable: true,
        },
        {
          id: 97,
          paymentProviderId: 6,
          bankId: 28,
          paymentProviderBankCode: 'NJCB',
          paymentProviderBankName: '南京银行',
          isAvailable: true,
        },
        {
          id: 98,
          paymentProviderId: 6,
          bankId: 19,
          paymentProviderBankCode: 'HZCB',
          paymentProviderBankName: '杭州银行',
          isAvailable: true,
        },
        {
          id: 99,
          paymentProviderId: 6,
          bankId: 20,
          paymentProviderBankCode: 'BJRCB',
          paymentProviderBankName: '北京农村商业银行',
          isAvailable: true,
        },
        {
          id: 100,
          paymentProviderId: 6,
          bankId: 29,
          paymentProviderBankCode: 'SRCB',
          paymentProviderBankName: '上海农商银行',
          isAvailable: true,
        },
        {
          id: 101,
          paymentProviderId: 7,
          bankId: 1,
          paymentProviderBankCode: 'ICBC',
          paymentProviderBankName: '中国工商银行',
          isAvailable: true,
        },
        {
          id: 102,
          paymentProviderId: 7,
          bankId: 2,
          paymentProviderBankCode: 'ABC',
          paymentProviderBankName: '中国农业银行',
          isAvailable: true,
        },
        {
          id: 103,
          paymentProviderId: 7,
          bankId: 3,
          paymentProviderBankCode: 'BOC',
          paymentProviderBankName: '中国银行',
          isAvailable: true,
        },
        {
          id: 104,
          paymentProviderId: 7,
          bankId: 4,
          paymentProviderBankCode: 'CCBC',
          paymentProviderBankName: '中国建设银行',
          isAvailable: true,
        },
        {
          id: 105,
          paymentProviderId: 7,
          bankId: 5,
          paymentProviderBankCode: 'BOCOM',
          paymentProviderBankName: '交通银行',
          isAvailable: true,
        },
        {
          id: 106,
          paymentProviderId: 7,
          bankId: 6,
          paymentProviderBankCode: 'PSBC',
          paymentProviderBankName: '中国邮政储蓄银行',
          isAvailable: true,
        },
        {
          id: 107,
          paymentProviderId: 7,
          bankId: 7,
          paymentProviderBankCode: 'CEB',
          paymentProviderBankName: '中国光大银行',
          isAvailable: true,
        },
        {
          id: 108,
          paymentProviderId: 7,
          bankId: 8,
          paymentProviderBankCode: 'CMBC',
          paymentProviderBankName: '中国民生银行',
          isAvailable: true,
        },
        {
          id: 109,
          paymentProviderId: 7,
          bankId: 9,
          paymentProviderBankCode: 'CMB',
          paymentProviderBankName: '招商银行',
          isAvailable: true,
        },
        {
          id: 110,
          paymentProviderId: 7,
          bankId: 10,
          paymentProviderBankCode: 'ECITIC',
          paymentProviderBankName: '中信银行',
          isAvailable: true,
        },
        {
          id: 111,
          paymentProviderId: 7,
          bankId: 11,
          paymentProviderBankCode: 'HXB',
          paymentProviderBankName: '华夏银行',
          isAvailable: true,
        },
        {
          id: 112,
          paymentProviderId: 7,
          bankId: 12,
          paymentProviderBankCode: 'SPDB',
          paymentProviderBankName: '上海浦东发展银行',
          isAvailable: true,
        },
        {
          id: 113,
          paymentProviderId: 7,
          bankId: 13,
          paymentProviderBankCode: 'PAB',
          paymentProviderBankName: '平安银行',
          isAvailable: true,
        },
        {
          id: 114,
          paymentProviderId: 7,
          bankId: 14,
          paymentProviderBankCode: 'CGB',
          paymentProviderBankName: '广发银行',
          isAvailable: true,
        },
        {
          id: 115,
          paymentProviderId: 7,
          bankId: 15,
          paymentProviderBankCode: 'CIB',
          paymentProviderBankName: '兴业银行',
          isAvailable: true,
        },
        {
          id: 116,
          paymentProviderId: 7,
          bankId: 16,
          paymentProviderBankCode: 'BOB',
          paymentProviderBankName: '北京银行',
          isAvailable: true,
        },
        {
          id: 117,
          paymentProviderId: 7,
          bankId: 17,
          paymentProviderBankCode: 'BOS',
          paymentProviderBankName: '上海银行',
          isAvailable: true,
        },
        {
          id: 118,
          paymentProviderId: 7,
          bankId: 18,
          paymentProviderBankCode: 'NBCB',
          paymentProviderBankName: '宁波银行',
          isAvailable: true,
        },
        {
          id: 119,
          paymentProviderId: 8,
          bankId: 1,
          paymentProviderBankCode: 'ICBC',
          paymentProviderBankName: '中国工商银行',
          isAvailable: true,
        },
        {
          id: 120,
          paymentProviderId: 8,
          bankId: 2,
          paymentProviderBankCode: 'ABC',
          paymentProviderBankName: '中国农业银行',
          isAvailable: true,
        },
        {
          id: 121,
          paymentProviderId: 8,
          bankId: 3,
          paymentProviderBankCode: 'BOC',
          paymentProviderBankName: '中国银行',
          isAvailable: true,
        },
        {
          id: 122,
          paymentProviderId: 8,
          bankId: 4,
          paymentProviderBankCode: 'CCBC',
          paymentProviderBankName: '中国建设银行',
          isAvailable: true,
        },
        {
          id: 123,
          paymentProviderId: 8,
          bankId: 5,
          paymentProviderBankCode: 'BOCOM',
          paymentProviderBankName: '交通银行',
          isAvailable: true,
        },
        {
          id: 124,
          paymentProviderId: 8,
          bankId: 6,
          paymentProviderBankCode: 'PSBC',
          paymentProviderBankName: '中国邮政储蓄银行',
          isAvailable: true,
        },
        {
          id: 125,
          paymentProviderId: 8,
          bankId: 7,
          paymentProviderBankCode: 'CEB',
          paymentProviderBankName: '中国光大银行',
          isAvailable: true,
        },
        {
          id: 126,
          paymentProviderId: 8,
          bankId: 8,
          paymentProviderBankCode: 'CMBC',
          paymentProviderBankName: '中国民生银行',
          isAvailable: true,
        },
        {
          id: 127,
          paymentProviderId: 8,
          bankId: 9,
          paymentProviderBankCode: 'CMB',
          paymentProviderBankName: '招商银行',
          isAvailable: true,
        },
        {
          id: 128,
          paymentProviderId: 8,
          bankId: 10,
          paymentProviderBankCode: 'ECITIC',
          paymentProviderBankName: '中信银行',
          isAvailable: true,
        },
        {
          id: 129,
          paymentProviderId: 8,
          bankId: 11,
          paymentProviderBankCode: 'HXB',
          paymentProviderBankName: '华夏银行',
          isAvailable: true,
        },
        {
          id: 130,
          paymentProviderId: 8,
          bankId: 12,
          paymentProviderBankCode: 'SPDB',
          paymentProviderBankName: '上海浦东发展银行',
          isAvailable: true,
        },
        {
          id: 131,
          paymentProviderId: 8,
          bankId: 13,
          paymentProviderBankCode: 'PAB',
          paymentProviderBankName: '平安银行',
          isAvailable: true,
        },
        {
          id: 132,
          paymentProviderId: 8,
          bankId: 14,
          paymentProviderBankCode: 'CGB',
          paymentProviderBankName: '广发银行',
          isAvailable: true,
        },
        {
          id: 133,
          paymentProviderId: 8,
          bankId: 15,
          paymentProviderBankCode: 'CIB',
          paymentProviderBankName: '兴业银行',
          isAvailable: true,
        },
        {
          id: 134,
          paymentProviderId: 8,
          bankId: 16,
          paymentProviderBankCode: 'BOB',
          paymentProviderBankName: '北京银行',
          isAvailable: true,
        },
        {
          id: 135,
          paymentProviderId: 8,
          bankId: 17,
          paymentProviderBankCode: 'BOS',
          paymentProviderBankName: '上海银行',
          isAvailable: true,
        },
        {
          id: 136,
          paymentProviderId: 8,
          bankId: 18,
          paymentProviderBankCode: 'NBCB',
          paymentProviderBankName: '宁波银行',
          isAvailable: true,
        },
        {
          id: 137,
          paymentProviderId: 9,
          bankId: 1,
          paymentProviderBankCode: 'ICBC',
          paymentProviderBankName: '中国工商银行',
          isAvailable: true,
        },
        {
          id: 138,
          paymentProviderId: 9,
          bankId: 2,
          paymentProviderBankCode: 'ABC',
          paymentProviderBankName: '中国农业银行',
          isAvailable: true,
        },
        {
          id: 139,
          paymentProviderId: 9,
          bankId: 3,
          paymentProviderBankCode: 'BOC',
          paymentProviderBankName: '中国银行',
          isAvailable: true,
        },
        {
          id: 140,
          paymentProviderId: 9,
          bankId: 4,
          paymentProviderBankCode: 'CCBC',
          paymentProviderBankName: '中国建设银行',
          isAvailable: true,
        },
        {
          id: 141,
          paymentProviderId: 9,
          bankId: 5,
          paymentProviderBankCode: 'BOCOM',
          paymentProviderBankName: '交通银行',
          isAvailable: true,
        },
        {
          id: 142,
          paymentProviderId: 9,
          bankId: 6,
          paymentProviderBankCode: 'PSBC',
          paymentProviderBankName: '中国邮政储蓄银行',
          isAvailable: true,
        },
        {
          id: 143,
          paymentProviderId: 9,
          bankId: 7,
          paymentProviderBankCode: 'CEB',
          paymentProviderBankName: '中国光大银行',
          isAvailable: true,
        },
        {
          id: 144,
          paymentProviderId: 9,
          bankId: 8,
          paymentProviderBankCode: 'CMBC',
          paymentProviderBankName: '中国民生银行',
          isAvailable: true,
        },
        {
          id: 145,
          paymentProviderId: 9,
          bankId: 9,
          paymentProviderBankCode: 'CMB',
          paymentProviderBankName: '招商银行',
          isAvailable: true,
        },
        {
          id: 146,
          paymentProviderId: 9,
          bankId: 10,
          paymentProviderBankCode: 'ECITIC',
          paymentProviderBankName: '中信银行',
          isAvailable: true,
        },
        {
          id: 147,
          paymentProviderId: 9,
          bankId: 11,
          paymentProviderBankCode: 'HXB',
          paymentProviderBankName: '华夏银行',
          isAvailable: true,
        },
        {
          id: 148,
          paymentProviderId: 9,
          bankId: 12,
          paymentProviderBankCode: 'SPDB',
          paymentProviderBankName: '上海浦东发展银行',
          isAvailable: true,
        },
        {
          id: 149,
          paymentProviderId: 9,
          bankId: 13,
          paymentProviderBankCode: 'PAB',
          paymentProviderBankName: '平安银行',
          isAvailable: true,
        },
        {
          id: 150,
          paymentProviderId: 9,
          bankId: 14,
          paymentProviderBankCode: 'CGB',
          paymentProviderBankName: '广发银行',
          isAvailable: true,
        },
        {
          id: 151,
          paymentProviderId: 9,
          bankId: 15,
          paymentProviderBankCode: 'CIB',
          paymentProviderBankName: '兴业银行',
          isAvailable: true,
        },
        {
          id: 152,
          paymentProviderId: 9,
          bankId: 16,
          paymentProviderBankCode: 'BOB',
          paymentProviderBankName: '北京银行',
          isAvailable: true,
        },
        {
          id: 153,
          paymentProviderId: 9,
          bankId: 17,
          paymentProviderBankCode: 'BOS',
          paymentProviderBankName: '上海银行',
          isAvailable: true,
        },
        {
          id: 154,
          paymentProviderId: 9,
          bankId: 18,
          paymentProviderBankCode: 'NBCB',
          paymentProviderBankName: '宁波银行',
          isAvailable: true,
        },
      ],
      {
        ignoreDuplicates: true,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('paymentProviderBank', null, {});
  },
};
