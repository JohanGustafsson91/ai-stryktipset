import { Accordion } from "components/Accordion";
import { PlayedMatch } from "components/PlayedMatch";
import { Game, Stryktips } from "models/Stryktips";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { useLazyRequest } from "./ManageNet.useLazyFetch";

export const ManageNet = () => {
  const [trainingData, setTrainingData] = useState<Game[]>([]);

  const [
    fetchPlayedGames,
    { data: playedGames, loading, error },
  ] = useLazyRequest<StryktipsResponse>();

  useEffect(() => {
    fetchPlayedGames("/played-games", undefined, { numOfRetries: 3 });
  }, [fetchPlayedGames]);

  const onAddTrainingData = (data: Game) =>
    setTrainingData([...trainingData, data]);

  const onRemoveTrainingData = (data: Game) =>
    setTrainingData(trainingData.filter(({ id }) => id !== data.id));

  return (
    <Content>
      <Column>
        <h3>Välj matcher</h3>
        {playedGames?.items.map(({ id, name, games }) => (
          <Accordion key={id} name={name}>
            {games.map((props) => (
              <PlayedMatch
                key={props.id}
                stats={props}
                callbackAdd={onAddTrainingData}
                callbackRemove={onRemoveTrainingData}
                checked={!!trainingData.find(({ id }) => id === props.id)}
              />
            ))}
          </Accordion>
        ))}
        {loading && <p>Laddar...</p>}
        {error && <p>Någonting gick fel när matcher skulle hämtas...</p>}
      </Column>
      <Column>
        <h3>Matcher att träna med</h3>
        {trainingData.map((game) => (
          <div key={game.id}>
            {game.homeTeam} vs {game.awayTeam}
          </div>
        ))}
        {trainingData.length === 0 && <span>Inga matcher tillagda...</span>}
      </Column>
    </Content>
  );
};

interface StryktipsResponse {
  items: Stryktips[];
}

const Content = styled.div`
  padding: 24px;
  display: flex;
`;

const Column = styled.div`
  flex: 1;
  padding-right: 24px; /* TODO */
`;

// TODO colors as --var
