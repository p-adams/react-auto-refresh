import { useEffect, useState } from "react";
function Home() {
  const [candidates, setCandidates] = useState<
    Array<{ id?: string; name: string }>
  >([]);
  const [currentCandidate, setCurrentCandidate] =
    useState<{ id?: string; name: string }>();
  useEffect(() => {
    fetch("/api/candidates")
      .then((res) => res.json())
      .then((res) => setCandidates(res));
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <form style={{ margin: "0 auto" }}>
        <h2>Cast Your Vote for The Next Mayor of Bedrock</h2>
        <input type="email" />
        <ul style={{ marginTop: "10px" }}>
          {candidates.map((candidate) => {
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
