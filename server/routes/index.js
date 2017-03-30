'use strict'
import Joi from 'joi'

export function routes (server) {
  const { callWithRequest } = server.plugins.elasticsearch.getCluster('data')
  // returns max 20 documents matching index pattern and containing selected geofield
  server.route({
    path: '/api/siren-solution/logs/{index}/{geofield}',
    method: 'GET',
    handler (req, reply) {
      callWithRequest(req, 'search', {
        index: req.params.index,
        type: 'log',
        body: {
          'from': 0,
          'size': 20,
          '_source': [req.params.geofield, '@timestamp', 'clientip', 'request']
        }
      }).then(response => reply(response.hits.hits))
    },
    config: {
      validate: {
        params: {
          index: Joi.string().regex(/^[a-zA-Z0-9-_.*]+$/).required(),
          geofield: Joi.string().regex(/^[a-zA-Z0-9-_.]+$/).required()
        }
      }
    }
  })
}
