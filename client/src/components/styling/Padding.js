import styled from 'styled-components';

const Padding = styled.div`
  padding-top: ${(props) => props.top}px;
  padding-right: ${(props) => props.right}px;
  padding-bottom: ${(props) => props.bottom}px;
  padding-left: ${(props) => props.left}px;
`;

Padding.defaultProps = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};

export default Padding;