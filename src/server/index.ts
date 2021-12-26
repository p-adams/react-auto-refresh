import Fastify, { FastifyInstance } from "fastify";
import { v4 as uuidv4 } from "uuid";
const server: FastifyInstance = Fastify({});
const votes: Array<FormData> = [];
const candidates: Array<{ id?: string; name: string }> = [
  { name: "Fred Flintstone" },
  { name: "Wilma Flintstone" },
  { name: "Mr Slate" },
].map((candidate) => ({ ...candidate, id: uuidv4() }));

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
  externalVoterId: string;
  email: string;
  isCounted: boolean;
  candidate: {
    id: string;
    full_name: string;
  };
}

interface FormType {
  data: FormData;
}

function processNewVote(voterData: FormData) {
  voterData.externalVoterId = uuidv4();
  voterData.isCounted = false;
  votes.push(voterData);
  console.log(votes);
  /*
  artificially make counting vote operation slow to mimick expensive calculation
  */
  setTimeout(() => {
    // count vote
    voterData.isCounted = true;
  }, 10000);

  return voterData;
}

server.get("/candidates", (req, res) => {
  res.send(candidates);
});

// TODO: create endpoint to poll to get votes as they are counted
server.get(
  "/votes/:id",
  {
    schema: {
      querystring: {
        id: { type: "string" },
      },
    },
  },
  (req, res) => {
    const { id } = req.params as { id: string };
    // find and check status of vote
    const vote = votes.find((vote) => vote.externalVoterId === id);
    if (vote?.isCounted) {
      res.send(votes);
      return;
    }
    res.send({ status: "still processing votes" });
  }
);

server.get("/", async (req, res) => {
  return { msg: "Meow" };
});
server.put<{ Body: FormType }>("/", (req, reply) => {
  const { data } = req.body;
  const existingVote = votes.find((vote) => vote.email === data.email);
  if (!existingVote) {
    // initialize vote creation

    const voter = processNewVote(data);
    // make external voter ID immediately available to client
    reply.send({ id: voter.externalVoterId, status: 200 });
    return;
  }
  reply.code(500).send({ message: "Error: Vote already cast." });
});

async function main() {
  try {
    await server.listen(4001);
  } catch (error) {
    server.log.error(error);
  }
}

main();
