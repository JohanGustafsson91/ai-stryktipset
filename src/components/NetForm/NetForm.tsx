import { ChangeEvent, useState } from "react";
import styled from "styled-components";

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
        <LabelContainer>
          <Label htmlFor="iterations">Iterationer</Label>
          <span>{form.iterations}</span>
        </LabelContainer>
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
        <LabelContainer>
          <Label htmlFor="errorThresh">Error threshold</Label>
          <span>{form.errorThresh}</span>
        </LabelContainer>
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

interface Form {
  iterations: number;
  errorThresh: number;
}

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

const LabelContainer = styled.label`
  display: flex;
  flex: 1;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 6px;
  flex: 1;
  color: grey;
`;
