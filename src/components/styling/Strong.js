import styled from 'styled-components';

const Strong = styled.span`
  font-size: ${props => props.fs};
  color: ${props => props.color};
  font-weight: 600;
  text-shadow: 0 0 10px #333;
`;

Strong.defaultProps = {
  "font-size": "14px",
  "font-color": "#262626"
};

export default Strong;