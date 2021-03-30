import styled from "styled-components";
import { color, ColorProps, layout, LayoutProps } from "styled-system";

export const CodeBlock = ({ data = {} }: Props) => (
  <Pre>{JSON.stringify(data, null, 2)}</Pre>
);

const Pre = styled.pre<ColorProps & LayoutProps>`
  ${layout};
  ${color}
`;
Pre.defaultProps = {
  backgroundColor: "var(--color-code-block)",
  minHeight: "40vh",
  maxHeight: "40vh",
  overflow: "auto",
};

interface Props {
  data: Record<string, unknown> | Array<unknown>;
}
