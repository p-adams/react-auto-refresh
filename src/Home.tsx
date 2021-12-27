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
  const [err, setErr] = useState("");

  const [currentCandidate, setCurrentCandidate] = useState<Candidate>();
  const [email, setEmail] = useState("john@smith.com");
  //const queryClient = useQueryClient();
  // TODO: consider moving to App so it can be shared by Home and Results
  const query = useQuery<Array<Candidate>>(
    "candidates",
    async () => await fetch("/api/candidates").then((res) => res.json())
  );

  const mutation = useMutation(
    async (newVote: Vote) => {
      return await fetch("/api/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: newVote,
        }),
      }).then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Error: Vote already cast.");
        }
      });
    },
    {
      onSuccess: (res) => {
        navigate(`results/${res.id}`);
      },
      onError: (err: any) => {
        setErr(err.message);
      },
    }
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <form
        style={{ margin: "0 auto" }}
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate({ email, candidate: currentCandidate });
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
        {mutation.isError && <div>{err}</div>}
      </form>
    </div>
  );
}

export default Home;
