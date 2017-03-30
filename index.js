import { routes } from './server/routes'

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],

    uiExports: {
      visTypes: ['plugins/siren-solution/siren-solution']
    },

    config (Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true)
      }).default()
    },

    init (server, options) {
      // Add server routes and initialize the plugin here
      routes(server)
    }
  })
};
