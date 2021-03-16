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
  padding: ${Space[8]};
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
      {definitions && <DefinitionsDiv>{definitions.join(',')}</DefinitionsDiv>}
      {examples && (
        <ExamplesTable>
          <tbody>
            {examples.map((ex) => {
              return (
                <tr>
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
