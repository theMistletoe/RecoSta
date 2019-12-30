import styled from 'styled-components';

const Text = styled.span`
  display: ${props => props.disp};
  text-align: ${props => props.ta};
  font-size: ${props => props.fs};
  color: ${props => props.color};
  font-weight: ${props => props.fw};
  line-height: ${props => props.lh};
`;

Text.defaultProps = {
  "display": "inline",
  "text-align": "left",
  "font-size": "12px",
  "color": "#4B5467",
  "font-weight": "normal",
  "line-height": "1px"
};

export default Text;