import { Accordion } from "components/Accordion";
import { NetForm } from "components/NetForm";
import { PlayedMatch } from "components/PlayedMatch";
import { Game, Odds, Stryktips } from "models/Stryktips";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { useLazyRequest } from "./ManageNet.useLazyFetch";
import { BoxFlex, Box } from "components/Box";
import { FetchContent } from "components/FetchContent";
import { CodeBlock } from "./ManageNet.CodeBlock";

export const ManageNet = () => {
  const [selectedGames, setSelectedGames] = useState<Game[]>([]);
  const [trainNet, { data: dataTrainNet }] = useLazyRequest<{ id: string }>();

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
    <BoxFlex flexDirection={["column"]}>
      <Row>
        <Column>
          <h3>Net options</h3>
          <NetForm onSubmit={(form) => trainNet(`/net`, { method: "post" })} />
        </Column>
        <Column>
          <h3>Status</h3>
          {dataTrainNet && <span>Connect to socket {dataTrainNet?.id}</span>}
        </Column>
      </Row>

      <Row>
        <Column>
          <h3>Select games</h3>
          <FetchContent<StryktipsResponse> url="/played-games">
            {({ data, loading, error }) => {
              if (loading) return <p>Loading</p>;
              if (error) return <p>Something went wrong</p>;

              return data?.items.map(({ id, name, games }, i) => (
                <Accordion key={id} name={name} initOpen={i === 0}>
                  <ButtonContainer mb={3}>
                    <button onClick={() => onAddTrainingData(games)}>
                      Välj alla
                    </button>
                    <button onClick={() => onRemoveTrainingData(games)}>
                      Ta bort alla
                    </button>
                  </ButtonContainer>

                  {games.map((props) => (
                    <PlayedMatch
                      key={props.id}
                      stats={props}
                      callbackAdd={onAddTrainingData}
                      callbackRemove={onRemoveTrainingData}
                      checked={
                        !!selectedGames.find(({ id }) => id === props.id)
                      }
                    />
                  ))}
                </Accordion>
              ));
            }}
          </FetchContent>
        </Column>

        <Column>
          <h3>Training data</h3>
          {selectedGames.length > 0 && (
            <CodeBlock data={gamesToTrainingData(selectedGames)} />
          )}
        </Column>
      </Row>
    </BoxFlex>
  );
};

// TODO make more generic
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

const Row = styled(BoxFlex)``;
Row.defaultProps = {
  flexDirection: ["column", "column", "row"],
};

const Column = styled(BoxFlex)``;
Column.defaultProps = {
  flexDirection: ["column"],
  p: [4],
};

const ButtonContainer = styled(Box)`
  button {
    margin-right: 12px;
  }
`;
