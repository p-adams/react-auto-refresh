import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
function Home() {
  const queryClient = useQueryClient();
  const query = useQuery<Array<{ id?: string; name: string }>>(
    "candidates",
    getCandidates
  );

  const [currentCandidate, setCurrentCandidate] =
    useState<{ id?: string; name: string }>();

  async function getCandidates() {
    return await fetch("/api/candidates").then((res) => res.json());
  }
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <form style={{ margin: "0 auto" }}>
        <h2>Cast Your Vote for The Next Mayor of Bedrock</h2>
        <input type="email" />
        <ul style={{ marginTop: "10px" }}>
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
