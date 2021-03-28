import { Odds } from "models/Stryktips";
import styled from "styled-components";

export const PercentBar = ({ odds }: Props) => {
  const oddsInPercent = objectValues<string>(odds, resultLabels).map(
    oddsToPercent
  );
  const oddsMarginal = (summarize(oddsInPercent) - 100) / 3;
  const normalizedOdds = oddsInPercent.map((t) => t - oddsMarginal);

  return (
    <Wrapper>
      {normalizedOdds.map((bar, i) => {
        const text = `${resultLabels[i]} (${bar.toFixed(0)}%)`;
        return (
          <Bar key={i} index={i} width={bar} title={text}>
            {text}
          </Bar>
        );
      })}
    </Wrapper>
  );
};

const resultLabels = ["1", "X", "2"];

const styleConfig = {
  textAligns: ["left", "center", "right"],
  bgColors: ["--color-bg-home-win", "--color-bg-draw", "--color-bg-away-win"],
  borderColors: ["--color-bg-draw", "--color-bg-draw", "--color-bg-away-win"],
  colors: ["--color-bg-draw", "--color-bg-home-win", "--color-bg-home-win"],
};

const objectValues = <T extends unknown>(
  object: Record<string, T>,
  keys: string[]
): Array<T> =>
  keys.reduce((acc, curr) => [...acc, object[curr]], [] as Array<T>);

const oddsToPercent = (odds: string) => (1 / parseFloat(odds)) * 100;

const summarize = (values: Array<number>) =>
  values.reduce((acc, curr) => acc + curr, 0);

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;

const Bar = styled.div<{ width: number; index: number }>`
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  float: left;
  width: ${({ width }) => `${width}%`};
  text-align: ${({ index }) => styleConfig.textAligns[index]};
  background-color: var(${({ index }) => styleConfig.bgColors[index]});
  color: var(${({ index }) => styleConfig.colors[index]});
  border: 1px solid var(${({ index }) => styleConfig.borderColors[index]});
  padding: 2px;
`;

interface Props {
  odds: Odds;
}
