// /lib/elasticsearch.js
import { Client } from '@elastic/elasticsearch';

export const esClient = new Client({
  node: `${process.env.ELASTIC_SEARCH_URL}`, // or your hosted endpoint
  auth: {
    username: `${process.env.ELASTIC_SEARCH_USER}`,
    password: `${process.env.ELASTIC_SEARCH_PASS}`
  },
  tls: {
    rejectUnauthorized: false
  }
});
