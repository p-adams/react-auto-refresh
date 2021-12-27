import Fastify, { FastifyInstance } from "fastify";
import { v4 as uuidv4 } from "uuid";
const server: FastifyInstance = Fastify({});
const votes: Array<FormData> = [];
const candidates: Array<{ id?: string; name: string; votes: number }> = [
  { name: "Fred Flintstone" },
  { name: "Wilma Flintstone" },
  { name: "Mr Slate" },
].map((candidate) => ({ ...candidate, id: uuidv4(), votes: 0 }));

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

let _t: NodeJS.Timeout;

function processNewVote(voterData: FormData) {
  voterData.externalVoterId = uuidv4();
  voterData.isCounted = false;
  votes.push(voterData);
  console.log(votes);
  /*
  artificially make counting vote operation slow to mimick expensive calculation
  */
  _t = setTimeout(() => {
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
    if (!vote) {
      res.code(500).send({ message: "Cannot find voter with that ID." });
      return;
    }
    if (vote?.isCounted) {
      /* TODO return mapping of candidates to votes instead of raw votes list
        electionBreakDown Array<{name: <string>, votes: <number>}>
      */
      for (const candidate of candidates) {
        candidate.votes = votes.filter(
          (vote) => vote.candidate.id === candidate.id
        ).length;
      }
      res.send({ vote, candidates });
      return;
    }
    res.send({
      voteStatus: "processing",
      vote,
    });
  }
);

server.put<{ Body: FormType }>("/", (req, reply) => {
  const { data } = req.body;
  // citizens of bedrock can only have a single email :)
  const existingVote = votes.find((vote) => vote.email === data.email);
  if (!existingVote) {
    // initialize voter creation

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
