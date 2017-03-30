import Joi from 'joi'
'use strict'

// Split the function to remove the index to its own function for unit testing.
export function indicesHandler (response) {
  const indexKeys = Object.keys(response.metadata.indices)
  // remove ".kibana" from indices returned
  for (let i = 0; i < indexKeys.length; i++){
    if(indexKeys[i] === '.kibana'){
      indexKeys.splice(i, 1)
      break
    }
  }
  return indexKeys
}

export function routes (server) {
  const { callWithRequest } = server.plugins.elasticsearch.getCluster('data')

  //initial route to seed the index patterns
  server.route({
    path: '/api/siren-solution/indices',
    method: 'GET',
    handler(req, reply) {
      callWithRequest(req, 'cluster.state', {
        metric: 'metadata',
        local: true
      }).then(response => {
        reply(indicesHandler(response))
      })
    }
  })

  // returns max 20 documents matching index pattern and containing selected geofield
  server.route({
    path: '/api/siren-solution/logs/{index}/{geofield}',
    method: 'GET',
    handler(req, reply) {
      callWithRequest(req, 'search',{
        index: req.params.index,
        type: 'log',
        body: {
          "from": 0,
          "size": 20,
          "_source": [req.params.geofield, "@timestamp", "clientip", "request"]
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
