import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";

function Results() {
  const params = useParams();

  const { isError, isLoading, data, error } = useQuery<{
    vote: Vote;
    candidates: Array<Candidate>;
    voteStatus: string;
  }>("election-data", getElectionData, {
    refetchInterval: 1000,
  });

  async function getElectionData() {
    const { id } = params;
    return await fetch(`/api/votes/${id}`).then((res) => {
      if (res.ok) {
        return res.json();
      }

      throw new Error("Error: Cannot find voter with that ID");
    });
  }

  if (isLoading) {
    return <span>loading...</span>;
  }

  if (isError) {
    return <span>{(error as any).message}</span>;
  }

  return (
    <div>
      <h2>Results</h2>

      <div>
        <div className="voter-information-card">
          <p>
            <span>{data?.vote?.email}</span>, you have submitted your vote for{" "}
            <span>{data?.vote?.candidate?.name}</span> as Mayor of Bedrock!
          </p>
        </div>
        {data?.voteStatus === "processing" && (
          <div className="notification-wrapper">
            Our servers are busy processing your vote.
          </div>
        )}
        <div className="election-breakdown">
          {!!data?.candidates && (
            <div className="election-table">
              <div className="table-col">Name</div>
              <div className="table-col votes">Votes</div>
              {data?.candidates.map((candidate) => (
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
    </div>
  );
}

export default Results;
