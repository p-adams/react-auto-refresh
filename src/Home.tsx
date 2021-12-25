import { useEffect, useState } from "react";
function Home() {
  const [candidates, setCandidates] = useState<
    Array<{ id?: string; name: string }>
  >([]);
  useEffect(() => {
    fetch("/api/candidates")
      .then((res) => res.json())
      .then((res) => setCandidates(res));
  }, []);
  return (
    <div>
      <h2>Cast Your Vote for Mayor of Bedrock</h2>
      <form>
        <input type="email" />
        <ul>
          {candidates.map((candidate) => {
            return (
              <li>
                <label>
                  <input type="radio" />
                  {candidate.name}
                </label>
              </li>
            );
          })}
        </ul>
      </form>
    </div>
  );
}

export default Home;
