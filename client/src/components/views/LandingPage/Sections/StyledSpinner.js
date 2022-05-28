import styled from 'styled-components';

export const StyledSpinner = styled.div`
  border: 4px solid #757575; /* grey */
  border-top: 5px solid #19ba90; /* Blixbox green */
  border-radius: 50%;
  width: 55px;
  height: 55px;
  animation: spin 0.8s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default StyledSpinner