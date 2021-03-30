import styled from "styled-components";
import {
  color,
  ColorProps,
  layout,
  LayoutProps,
  space,
  SpaceProps,
  typography,
  border,
  BorderProps,
  position,
  PositionProps,
  TypographyProps,
} from "styled-system";

export const Box = styled.div<BoxProps>`
  ${space}
  ${layout}
	${typography}
	${color}
	${border}
	${position}
`;

Box.defaultProps = {
  position: "relative",
};

export type BoxProps = SpaceProps &
  LayoutProps &
  ColorProps &
  BorderProps &
  TypographyProps &
  PositionProps;
