import { BoxFlex } from "components/Box";
import { ChangeEvent, useState } from "react";
import styled from "styled-components";
import {
  color,
  ColorProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from "styled-system";

export const NetForm = ({ onSubmit }: Props) => {
  const [form, setForm] = useState<Form>({
    errorThresh: 0.05,
    iterations: 20000,
  });

  const updateForm = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  return (
    <div>
      <FormField>
        <BoxFlex>
          <Label htmlFor="iterations">Iterationer</Label>
          <span>{form.iterations}</span>
        </BoxFlex>
        <input
          type="range"
          name="iterations"
          min="20000"
          max="10000000"
          step="10000"
          onChange={updateForm}
          value={form.iterations}
        />
      </FormField>

      <FormField>
        <BoxFlex>
          <Label htmlFor="errorThresh">Error threshold</Label>
          <span>{form.errorThresh}</span>
        </BoxFlex>
        <input
          type="range"
          name="errorThresh"
          min="0.001"
          max="0.05"
          step="0.001"
          onChange={updateForm}
          value={form.errorThresh}
        />
      </FormField>

      <button onClick={() => onSubmit(form)}>Train</button>
    </div>
  );
};

interface Props {
  onSubmit: (args: Form) => void;
}

export interface Form {
  iterations: number;
  errorThresh: number;
}

const FormField = styled(BoxFlex)``;
FormField.defaultProps = {
  flexDirection: "column",
  mb: 4,
};

const Label = styled.label<TypographyProps & SpaceProps & ColorProps>`
  ${space}
  ${typography}
  ${color}
  flex: 1;
`;
Label.defaultProps = {
  fontWeight: "bold",
  mb: 2,
  color: "var(--color-bg-away-win)",
};
