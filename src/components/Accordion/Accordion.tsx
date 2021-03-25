import { PropsWithChildren, ReactElement, useState } from "react";
import styled from "styled-components";

export const Accordion = ({
  name,
  initOpen = false,
  children,
}: PropsWithChildren<AccordionProps>): ReactElement => {
  const [open, setOpen] = useState(initOpen);

  return (
    <Wrapper>
      <Header onClick={() => setOpen(!open)}>{name}</Header>
      {open && <Content>{children}</Content>}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 12px;
`;

const Header = styled.div`
  background-color: #eee;
  border: 1px solid #eee;
  padding: 12px;
  cursor: pointer;
`;

const Content = styled.div`
  padding: 12px;
  border: 1px solid #eee;
`;

interface AccordionProps {
  name: string | ReactElement;
  initOpen?: boolean;
}
