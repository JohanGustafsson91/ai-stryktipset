import { PercentBar } from "components/PercentBar";
import { Game } from "models/Stryktips";
import styled from "styled-components";

export const PlayedMatch = ({
  stats,
  checked,
  callbackAdd,
  callbackRemove,
}: Props) => {
  const onChecked = () =>
    !checked ? callbackAdd(stats) : callbackRemove(stats);

  return (
    <Wrapper>
      <Checkbox checked={checked} onChange={onChecked} />
      <Flex>
        {stats.homeTeam} vs {stats.awayTeam}
      </Flex>
      <Flex>
        <PercentBar odds={stats.odds} />
      </Flex>
      <Result>{stats.result}</Result>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-bottom: 12px;
  display: flex;
  align-items: center;
`;

const Checkbox = styled.input`
  margin-right: 12px;
`;
Checkbox.defaultProps = { type: "checkbox" };

const Flex = styled.div`
  flex: 1;
`;

const Result = styled.div`
  padding: 6px;
`;

interface Props {
  stats: Game;
  callbackAdd: (arg0: Game) => void;
  callbackRemove: (arg0: Game) => void;
  checked: boolean;
}
