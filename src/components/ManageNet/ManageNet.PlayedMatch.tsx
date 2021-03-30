import { Box, BoxFlex } from "components/Box";
import { PercentBar } from "components/PercentBar";
import { PlayedGame } from "models/Stryktips";
import styled from "styled-components";
import { SpaceProps, space } from "styled-system";

export const PlayedMatch = ({
  stats,
  checked,
  callbackAdd,
  callbackRemove,
}: Props) => {
  const onChecked = () =>
    !checked ? callbackAdd([stats]) : callbackRemove([stats]);

  return (
    <BoxFlex alignItems="center" mb={2} onClick={onChecked}>
      <Checkbox checked={checked} onChange={onChecked} />
      <BoxFlex>
        {stats.homeTeam} vs {stats.awayTeam}
      </BoxFlex>
      <BoxFlex minWidth="270px">
        <PercentBar odds={stats.odds} />
      </BoxFlex>
      <Box ml={2} p={1}>
        {stats.result}
      </Box>
    </BoxFlex>
  );
};

const Checkbox = styled.input<SpaceProps>`
  ${space}
`;
Checkbox.defaultProps = { type: "checkbox", mr: 3 };

interface Props {
  stats: PlayedGame;
  callbackAdd: (arg0: PlayedGame[]) => void;
  callbackRemove: (arg0: PlayedGame[]) => void;
  checked: boolean;
}
