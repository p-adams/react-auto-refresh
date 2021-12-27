import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Results() {
  const params = useParams();
  const [notification, setNotification] = useState();
  const [vote, setVote] = useState<Vote>();
  const [candidates, setCandidate] = useState<Array<Candidate>>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const { id } = params;
    fetch(`/api/votes/${id}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        throw new Error("Error: Cannot find voter with that ID");
      })
      .then((res) => {
        setVote(res.vote);
        if (res.status === "processing") {
          setNotification(res.message);
          return;
        }
        setCandidate(res.candidates);
      })
      .catch((err) => setError(err.message));
  }, [params]);

  return (
    <div>
      <h2>Results</h2>
      {!error ? (
        <div>
          <div className="voter-information-card">
            <h3>
              {vote?.email}, you have submitted your vote for Mayor of Bedrock!
            </h3>
            <div>Candidate: {vote?.candidate?.name}</div>
          </div>
          {notification && (
            <div className="notification-wrapper">{notification}</div>
          )}
          <div className="election-breakdown">
            {candidates.map((candidate) => (
              <div key={candidate.id}>
                {candidate.name} - {candidate.votes}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>Server Error</div>
      )}
    </div>
  );
}

export default Results;
