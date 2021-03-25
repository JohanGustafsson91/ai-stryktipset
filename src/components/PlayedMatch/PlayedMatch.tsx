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
      <input checked={checked} type="checkbox" onChange={onChecked} />
      <span>
        {stats.homeTeam} vs {stats.awayTeam}
      </span>
      <span>-Medeloddsbar-</span>
      <span>{stats.result}</span>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-bottom: 6px;
`;

interface Props {
  stats: Game;
  callbackAdd: (arg0: Game) => void;
  callbackRemove: (arg0: Game) => void;
  checked: boolean;
}
