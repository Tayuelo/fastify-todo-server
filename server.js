import Fastify from 'fastify';
import routes from './routes/routes.js';
import dbConnector from './db/db-connector.js';
import cors from '@fastify/cors'
import 'dotenv/config'

const fastify = Fastify({
    logger: true
});

fastify.register(cors);
fastify.register(dbConnector);
fastify.register(routes); // This is the only way to add routes, plugins, etc

try {
    await fastify.listen({ port: 3000 })
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
