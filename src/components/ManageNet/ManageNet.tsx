import { Accordion } from "components/Accordion";
import { Form, NetForm } from "./ManageNet.NetForm";
import { PlayedMatch } from "./ManageNet.PlayedMatch";
import { PlayedGame, Odds, Stryktips } from "models/Stryktips";
import { useState } from "react";
import styled from "styled-components";
import { BoxFlex, Box } from "components/Box";
import { FetchContent } from "components/FetchContent";
import { CodeBlock } from "./ManageNet.CodeBlock";
import { oddsToPercent } from "utils";
import { useAsyncTask, request } from "shared";
import { GET_STRYKTIPS_ENDPOINT, POST_NET_ENDPOINT } from "shared/endpoints";

export const ManageNet = () => {
  const [selectedGames, setSelectedGames] = useState<PlayedGame[]>([]);
  const [
    trainNet,
    { data: dataTrainNet, error: errorTrainNet, status: statusPostNet },
  ] = useAsyncTask(postTrainNet);

  const onAddTrainingData = (data: PlayedGame[]) =>
    setSelectedGames([...selectedGames, ...data]);

  const onRemoveTrainingData = (data: PlayedGame[]) =>
    setSelectedGames(
      selectedGames.filter(({ id }) => !data.find((d) => d.id === id))
    );

  return (
    <BoxFlex flexDirection={["column"]}>
      <Row>
        <Column>
          <h3>Net options</h3>
          <NetForm
            disabledSubmitButton={
              selectedGames.length === 0 || statusPostNet === "pending"
            }
            onSubmit={(form: Form) => trainNet(form, selectedGames)}
          />
        </Column>
        <Column>
          <h3>Status</h3>
          {dataTrainNet && <i>Connect to socket {dataTrainNet?.id}</i>}
          {errorTrainNet && <span>Could not train net...</span>}
        </Column>
      </Row>

      <Row>
        <Column>
          <h3>Select games</h3>
          <FetchContent<StryktipsResponse> url={GET_STRYKTIPS_ENDPOINT}>
            {({ data, loading, error }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Could not fetch stryktips data</p>;

              return data?.items.map(({ id, name, games }, i) => (
                <Accordion key={id} name={name} initOpen={i === 0}>
                  <ButtonContainer mb={3}>
                    <button onClick={() => onAddTrainingData(games)}>
                      Select all
                    </button>
                    <button onClick={() => onRemoveTrainingData(games)}>
                      Remove all
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

const postTrainNet = (
  form: Form,
  trainingData: PlayedGame[]
): Promise<{ id: string }> =>
  request(POST_NET_ENDPOINT, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      errorThresh: parseFloat(form.errorThresh.toString()),
      iterations: parseInt(form.iterations.toString()),
      trainingData: gamesToTrainingData(trainingData),
    }),
  });

const gamesToTrainingData = (trainingData: PlayedGame[]) =>
  trainingData
    .filter((game: PlayedGame) => game.result !== null)
    .map((game: PlayedGame) => ({
      input: Object.keys(game.odds).reduce(
        (acc, curr) => ({
          ...acc,
          [curr]: parseFloat(
            oddsToPercent(game.odds[curr as keyof Odds]).toFixed(2)
          ),
        }),
        {}
      ),
      output: {
        [game.result as string]: 1,
      },
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
