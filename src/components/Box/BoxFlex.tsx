import styled from "styled-components";
import { flexbox, FlexboxProps } from "styled-system";
import { Box, BoxProps } from "./Box";

export const BoxFlex = styled(Box)<BoxFlexProps>`
  ${flexbox}
`;

BoxFlex.defaultProps = {
  display: "flex",
  flex: 1,
};

type BoxFlexProps = BoxProps & FlexboxProps;
