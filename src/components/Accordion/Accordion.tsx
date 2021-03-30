import { Box } from "components/Box";
import { PropsWithChildren, ReactElement, useState } from "react";
import styled from "styled-components";

export const Accordion = ({
  name,
  initOpen = false,
  children,
}: PropsWithChildren<AccordionProps>): ReactElement => {
  const [open, setOpen] = useState(initOpen);

  return (
    <Box width="100%" mb={3}>
      <Header onClick={() => setOpen(!open)}>{name}</Header>
      {open && (
        <Box p={3} border={border}>
          {children}
        </Box>
      )}
    </Box>
  );
};

const border = "1px solid var(--color-accordion-header)";

const Header = styled(Box)`
  cursor: pointer;
`;
Header.defaultProps = {
  backgroundColor: "var(--color-accordion-header)",
  padding: 3,
  border: border,
};

interface AccordionProps {
  name: string | ReactElement;
  initOpen?: boolean;
}
