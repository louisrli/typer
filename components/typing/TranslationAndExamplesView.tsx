import styled from '@emotion/styled';
import React from 'react';
import { Space } from '../common/Styles';

const ContainerDiv = styled.div`
  margin-top: ${Space[128]};
  padding: 0 ${Space[24]};
  width: 100%;
  font-size: ${Space[20]};
`;

const DefinitionsDiv = styled.div`
  text-align: center;
  margin-bottom: ${Space[64]};
`;

const ExamplesTable = styled.table`
  width: 100%;
  td {
    padding-right: ${Space[12]};
    padding-bottom: ${Space[16]};
  }
  font-size: ${Space[16]};
`;

interface DefinitionAndExamplesProps {
  definitions?: string[];
  examples?: [string, string?][];
}

const DefinitionAndExamplesView: React.FC<DefinitionAndExamplesProps> = ({
  definitions,
  examples,
}) => {
  return (
    <ContainerDiv>
      {definitions && <DefinitionsDiv>{definitions.join(', ')}</DefinitionsDiv>}
      {examples && (
        <ExamplesTable>
          <tbody>
            {examples.map((ex) => {
              return (
                <tr key={ex[0]}>
                  <td>{ex[0]}</td>
                  <td>{ex[1]}</td>
                </tr>
              );
            })}
          </tbody>
        </ExamplesTable>
      )}
    </ContainerDiv>
  );
};

export default DefinitionAndExamplesView;
