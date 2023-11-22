import fastifyMongodb from "@fastify/mongodb";
import fastifyPlugin from "fastify-plugin";

async function dbConnector(fastify, options) {
  fastify.register(fastifyMongodb, {
    url: process.env.MONGODB_URI,
  });
}

export default fastifyPlugin(dbConnector);
