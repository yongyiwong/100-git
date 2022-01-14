'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    await queryInterface.bulkInsert(
      'bank',
      [
        {
          id: 1,
          bankCode: 'ICBC',
          bankName: '中国工商银行',
          isAvailable: true,
        },
        {
          id: 2,
          bankCode: 'ABOC',
          bankName: '中国农业银行',
          isAvailable: true,
        },
        {
          id: 3,
          bankCode: 'BOC',
          bankName: '中国银行',
          isAvailable: true,
        },
        {
          id: 4,
          bankCode: 'CCB',
          bankName: '中国建设银行',
          isAvailable: true,
        },
        {
          id: 5,
          bankCode: 'BOCOM',
          bankName: '交通银行',
          isAvailable: true,
        },
        {
          id: 6,
          bankCode: 'PSBC',
          bankName: '中国邮政储蓄银行',
          isAvailable: true,
        },
        {
          id: 7,
          bankCode: 'CEB',
          bankName: '中国光大银行',
          isAvailable: true,
        },
        {
          id: 8,
          bankCode: 'CMBC',
          bankName: '民生银行',
          isAvailable: true,
        },
        {
          id: 9,
          bankCode: 'CMB',
          bankName: '招商银行',
          isAvailable: true,
        },
        {
          id: 10,
          bankCode: 'ECITIC',
          bankName: '中信银行',
          isAvailable: true,
        },
        {
          id: 11,
          bankCode: 'HXB',
          bankName: '华夏银行',
          isAvailable: true,
        },
        {
          id: 12,
          bankCode: 'SPDB',
          bankName: '浦发银行',
          isAvailable: true,
        },
        {
          id: 13,
          bankCode: 'PAB',
          bankName: '平安银行',
          isAvailable: true,
        },
        {
          id: 14,
          bankCode: 'CGB',
          bankName: '广发银行',
          isAvailable: true,
        },
        {
          id: 15,
          bankCode: 'CIB',
          bankName: '兴业银行',
          isAvailable: true,
        },
        {
          id: 16,
          bankCode: 'BOB',
          bankName: '北京银行',
          isAvailable: true,
        },
        {
          id: 17,
          bankCode: 'BOS',
          bankName: '上海银行',
          isAvailable: true,
        },
        {
          id: 18,
          bankCode: 'NBCB',
          bankName: '宁波银行',
          isAvailable: true,
        },
        {
          id: 19,
          bankCode: 'HZB',
          bankName: '杭州银行',
          isAvailable: true,
        },
        {
          id: 20,
          bankCode: 'BCRCB',
          bankName: '北京农商银行',
          isAvailable: true,
        },
        {
          id: 21,
          bankCode: 'HCCBCNBH',
          bankName: '哈尔滨银行',
          isAvailable: true,
        },
        {
          id: 22,
          bankCode: 'CZB',
          bankName: '浙商银行',
          isAvailable: true,
        },
        {
          id: 23,
          bankCode: 'CHCCCNSS',
          bankName: '长沙银行',
          isAvailable: true,
        },
        {
          id: 24,
          bankCode: 'QCCBCNBQ',
          bankName: '青岛银行',
          isAvailable: true,
        },
        {
          id: 25,
          bankCode: 'SDB',
          bankName: '深圳发展银行',
          isAvailable: true,
        },
        {
          id: 26,
          bankCode: 'CBHB',
          bankName: '渤海银行',
          isAvailable: true,
        },
        {
          id: 27,
          bankCode: 'HKBEA',
          bankName: '东亚银行',
          isAvailable: true,
        },
        {
          id: 28,
          bankCode: 'NJCB',
          bankName: '南京银行',
          isAvailable: true,
        },
        {
          id: 29,
          bankCode: 'SRCB',
          bankName: '上海农商银行',
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
    await queryInterface.bulkDelete('bank', null, {});
  },
};
