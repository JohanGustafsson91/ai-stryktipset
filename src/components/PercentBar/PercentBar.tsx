import { Box } from "components/Box";
import { Odds } from "models/Stryktips";
import styled from "styled-components";

export const PercentBar = ({ odds }: Props) => {
  const oddsInPercent = objectValues<string>(odds, resultLabels).map(
    oddsToPercent
  );
  const oddsMarginal = (summarize(oddsInPercent) - 100) / 3;
  const normalizedOdds = oddsInPercent.map((t) => t - oddsMarginal);

  return (
    <Box width="100%" overflow="hidden">
      {normalizedOdds.map((bar, i) => {
        const text = `${resultLabels[i]} (${bar.toFixed(0)}%)`;
        return (
          <Bar
            key={i}
            width={`${bar}%`}
            title={text}
            textAlign={styleConfig.textAligns[i] as "left" | "center" | "right"}
            backgroundColor={styleConfig.bgColors[i]}
            color={styleConfig.colors[i]}
            border={`1px solid ${styleConfig.borderColors[i]}`}
          >
            {text}
          </Bar>
        );
      })}
    </Box>
  );
};

const resultLabels = ["1", "X", "2"];

const styleConfig = {
  textAligns: ["left", "center", "right"],
  bgColors: [
    "var(--color-bg-home-win)",
    "var(--color-bg-draw)",
    "var(--color-bg-away-win)",
  ],
  borderColors: [
    "var(--color-bg-draw)",
    "var(--color-bg-draw)",
    "var(--color-bg-away-win)",
  ],
  colors: [
    "var(--color-bg-draw)",
    "var(--color-bg-home-win)",
    "var(--color-bg-home-win)",
  ],
};

const objectValues = <T extends unknown>(
  object: Record<string, T>,
  keys: string[]
): Array<T> =>
  keys.reduce((acc, curr) => [...acc, object[curr]], [] as Array<T>);

const oddsToPercent = (odds: string) => (1 / parseFloat(odds)) * 100;

const summarize = (values: Array<number>) =>
  values.reduce((acc, curr) => acc + curr, 0);

const Bar = styled(Box)`
  white-space: nowrap;
  text-overflow: ellipsis;
  float: left;
`;
Bar.defaultProps = {
  fontSize: 0,
  overflow: "hidden",
  p: 1,
};

interface Props {
  odds: Odds;
}
