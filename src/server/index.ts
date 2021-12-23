import Fastify, { FastifyInstance } from "fastify";
const server: FastifyInstance = Fastify({});
const votes: Array<FormData> = [];

/**
 * sample request:
 * {
	"data": {
		"email": "roger@acme.com",
		"candidate": {
			"id": "_idx45xfE0",
			"full_name": "Fred Flintstone"
		}
	}
}
 */
interface FormData {
  email: string;
  candidate: {
    id: string;
    full_name: string;
  };
}

interface FormType {
  data: FormData;
}
server.get("/", async (req, res) => {
  return { msg: "Meow" };
});
server.post<{ Body: FormType }>("/", (req, reply) => {
  const { data } = req.body;
  const existingVote = votes.find((vote) => vote.email === data.email);
  if (!existingVote) {
    votes.push(data);
  }

  reply.send({ status: 200 });
});

async function main() {
  try {
    await server.listen(4001);
  } catch (error) {
    server.log.error(error);
  }
}

main();
