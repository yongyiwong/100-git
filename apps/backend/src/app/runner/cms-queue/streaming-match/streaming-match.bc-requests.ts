export class StreamingMatchBcRequests {
  eventRequest(timeRange, bcSport) {
    return {
      command: 'get',
      params: {
        source: 'betting',
        what: {
          game: [
            'game',
            'start_ts',
            'team1_name',
            'team2_name',
            'team1_id',
            'team2_id',
          ],
          sport: ['name', 'id'],
        },
        where: {
          sport: {
            alias: bcSport,
          },
          game: {
            start_ts: {
              '@gte': timeRange.date,
              '@lte': timeRange.lastDay,
            },
            type: { '@in': [1, 2] },
          },
        },
        subscribe: false,
      },
      rid: 'subscribeCmd81540084160063',
    };
  }

  calculateNowPlusDays(days: number) {
    const date = Math.floor(Date.now() / 1000) - 5 * 60 * 60 * 10000;
    const lastDay = date + days * 24 * 60 * 60 * 1000;
    return { date, lastDay };
  }

  bcSportList() {
    return [
      'Soccer',
      'Basketball',
      'Tennis',
      'Baseball',
      'Volleyball',
      'RugbyUnion',
      'RugbyLeague',
      'TableTennis',
    ];
  }

  requestSession() {
    return {
      command: 'request_session',
      params: {
        language: 'eng',
        site_id: '1871111',
      },
    };
  }
}
