/**
 * Facilities to fetch stats data from Elasticsearch.
 */

'use strict';

const es = require('elasticsearch');
const moment = require('moment');

function makeIndexName() {
  const today = moment(Date.now()).format('YYYY.MM.DD');

  return 'see-stats-' + today;
}

function makeCountFilters(termFilter) {
  const body = {
    'query': {
      'bool': {
        'must': [
          {
            'range': {
              '@timestamp': {
                'from': 'now-1s/s',
                'to': 'now'
              }
            }
          },
          {"filtered": {"filter": {"not": {"term": {"server_name": "hackergames" }}}}}
        ]
      }
    }
  };

  if (termFilter) {
    body['filter'] = {'term': termFilter};
  }

  return {
    index: makeIndexName(),
    body: body
  }
}

class Client {

  constructor() {
    this.esConn = null;
  }

  connect(host) {
    this.esConn = new es.Client({host: host});
  }

  /**
   * Fetches for new stats data every second.
   */
  startFetchingStats(socket, termFilter) {
    console.log('Start fetching');

    setInterval(() => {this.fetchCount(socket, termFilter);}, 1000);
  }

  fetchCount(socket, termFilter) {
    this.esConn.count(makeCountFilters(termFilter), (err, resp) => {
      if (err) {
        console.log('Failed to fetch count:', err);
        return;
      };

      socket.emit('event_count', resp.count);
    });
  }
};

exports.Client = Client;


exports.fetch = function () {
  console.log('fetch stats');
};
