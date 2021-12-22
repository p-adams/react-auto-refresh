import Fastify, { FastifyInstance } from "fastify";
const server: FastifyInstance = Fastify({});
server.get("/", async (req, res) => {
  return { msg: "Meow" };
});

async function main() {
  try {
    await server.listen(4001);
  } catch (error) {
    server.log.error(error);
  }
}

main();
