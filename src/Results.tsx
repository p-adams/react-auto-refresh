import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Results() {
  const params = useParams();
  const [notification, setNotification] = useState();
  const [vote, setVote] = useState<Vote>();
  const [votes, setVotes] = useState<Array<Vote>>([]);
  useEffect(() => {
    const { id } = params;
    fetch(`/api/votes/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setVote(res.vote);
        if (res.status === "processing") {
          setNotification(res.message);
          return;
        }
        setVotes(res.votes);
      });
  }, [params]);
  return (
    <div>
      <h2>Results</h2>
      <div className="voter-information-card">
        <h3>
          {vote?.email}, you have submitted your vote for Mayor of Bedrock!
        </h3>
        <div>Candidate: {vote?.candidate?.name}</div>
      </div>
      {notification && <div>{notification}</div>}
      <div className="election-breakdown">
        {/* display list of candidates * */}
      </div>
    </div>
  );
}

export default Results;
