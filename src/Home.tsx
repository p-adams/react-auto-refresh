import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
interface Candidate {
  id: string;
  name: string;
}
interface Vote {
  email: string;
  location?: string;
  candidate?: Candidate;
}
function Home() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const query = useQuery<Array<Candidate>>("candidates", getCandidates);

  const mutation = useMutation(vote, {});

  const [currentCandidate, setCurrentCandidate] = useState<Candidate>();
  const [email, setEmail] = useState("john@smith.com");

  async function getCandidates() {
    return await fetch("/api/candidates").then((res) => res.json());
  }
  async function vote() {
    await fetch("/api/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          email,
          candidate: currentCandidate,
        },
      }),
    });
    // TODO send voter ID as param
    navigate("/results");
  }
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <form
        style={{ margin: "0 auto" }}
        onSubmit={(e) => {
          e.preventDefault();
          vote();
        }}
      >
        <h2>Cast Your Vote for The Next Mayor of Bedrock</h2>
        <label>
          <h4>Email</h4>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </label>

        <ul style={{ margin: "10px 0 10px 0" }}>
          {query.data?.map((candidate) => {
            return (
              <li key={candidate.id}>
                <label onClick={() => setCurrentCandidate(candidate)}>
                  <input
                    type="radio"
                    checked={candidate.id === currentCandidate?.id}
                    readOnly
                  />
                  {candidate.name}
                </label>
              </li>
            );
          })}
        </ul>
        <button type="submit">Vote</button>
      </form>
    </div>
  );
}

export default Home;
