// /lib/elasticsearch.js
import { Client } from '@elastic/elasticsearch';

export const esClient = new Client({
  node: `${process.env.ELASTIC_SEARCH_URL}`, // or your hosted endpoint
  auth: {
    username: 'elastic',
    password: 'vorsto2025%%'
  },
  tls: {
    rejectUnauthorized: false
  }
});
