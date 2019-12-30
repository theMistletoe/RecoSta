import styled from 'styled-components';

const Button = styled.button`
  /* Adapt the colors based on primary prop */
  background: ${props => props.primary ? "#1abc9c" : "white"};
  color: ${props => props.primary ? "white" : "#1abc9c"};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #1abc9c;
  border-radius: 3px;
`;

export default Button;