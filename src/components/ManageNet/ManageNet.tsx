import { Accordion } from "components/Accordion";
import { NetForm } from "components/NetForm";
import { PlayedMatch } from "components/PlayedMatch";
import { Game, Odds, Stryktips } from "models/Stryktips";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { useLazyRequest } from "./ManageNet.useLazyFetch";

export const ManageNet = () => {
  const [selectedGames, setSelectedGames] = useState<Game[]>([]);

  const [
    fetchPlayedGames,
    { data: playedGames, loading, error },
  ] = useLazyRequest<StryktipsResponse>();

  const [trainNet, { data: dataTrainNet }] = useLazyRequest<unknown>();

  useEffect(() => {
    fetchPlayedGames("/played-games", undefined, { numOfRetries: 3 });
  }, [fetchPlayedGames]);

  useEffect(() => {
    if (!dataTrainNet) return;
    console.log("Listen for changes on socket", dataTrainNet);
  }, [dataTrainNet]);

  const onAddTrainingData = (data: Game[]) =>
    setSelectedGames([...selectedGames, ...data]);

  const onRemoveTrainingData = (data: Game[]) =>
    setSelectedGames(
      selectedGames.filter(({ id }) => !data.find((d) => d.id === id))
    );

  return (
    <Content>
      <Row>
        <Column>
          <h3>Net options</h3>
          <NetForm onSubmit={(form) => trainNet(`/net`, { method: "post" })} />
        </Column>
        <Column>
          <h3>Status</h3>
        </Column>
      </Row>
      <Row>
        <Column>
          <h3>Select games</h3>
          {playedGames?.items.map(({ id, name, games }, i) => (
            <Accordion key={id} name={name} initOpen={i === 0}>
              <>
                <button onClick={() => onAddTrainingData(games)}>
                  Välj alla
                </button>
                <button onClick={() => onRemoveTrainingData(games)}>
                  Ta bort alla
                </button>
                {games.map((props) => (
                  <PlayedMatch
                    key={props.id}
                    stats={props}
                    callbackAdd={onAddTrainingData}
                    callbackRemove={onRemoveTrainingData}
                    checked={!!selectedGames.find(({ id }) => id === props.id)}
                  />
                ))}
              </>
            </Accordion>
          ))}
          {loading && <p>Loading...</p>}
          {error && <p>Something went wrong when fetching games</p>}
        </Column>
        <Column>
          <h3>Training data</h3>
          {selectedGames.length > 0 && (
            <Pre>
              {JSON.stringify(gamesToTrainingData(selectedGames), null, 1)}
            </Pre>
          )}
        </Column>
      </Row>
    </Content>
  );
};

const gamesToTrainingData = (trainingData: Game[]) =>
  trainingData.map((game) => ({
    input: Object.keys(game.odds).reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: (1 / parseFloat(game.odds[curr as keyof Odds])).toFixed(2),
      }),
      {}
    ),
    output: game.result,
  }));

interface StryktipsResponse {
  items: Stryktips[];
}

const Content = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex: 1;
`;

const Column = styled.div`
  flex: 1;
  padding-right: 24px; /* TODO */
`;

const Pre = styled.pre`
  background-color: #eee;
  min-height: 40vh;
  max-height: 40vh;
  overflow: auto;
`;
