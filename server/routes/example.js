export default function (server) {

  server.route({
    path: '/api/siren_solution/example',
    method: 'GET',
    handler(req, reply) {
      reply({ time: (new Date()).toISOString() });
    }
  });

}
