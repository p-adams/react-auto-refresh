import { Fragment, useEffect, useState } from "react";
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
            <p>
              <span>{vote?.email}</span>, you have submitted your vote for{" "}
              <span>{vote?.candidate?.name}</span> as Mayor of Bedrock!
            </p>
          </div>
          {notification && (
            <div className="notification-wrapper">{notification}</div>
          )}
          <div className="election-breakdown">
            {!!candidates.length && (
              <div className="election-table">
                <div className="table-col">Name</div>
                <div className="table-col votes">Votes</div>
                {candidates.map((candidate) => (
                  <Fragment key={candidate.id}>
                    <div className="table-row">{candidate.name}</div>
                    <div className="table-row votes-column">
                      {candidate.votes}
                    </div>
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>Server Error</div>
      )}
    </div>
  );
}

export default Results;
