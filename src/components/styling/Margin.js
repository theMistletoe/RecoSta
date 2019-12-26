import styled from 'styled-components';

const Margin = styled.div`
  margin-top: ${(props) => props.top};
  margin-right: ${(props) => props.right};
  margin-bottom: ${(props) => props.bottom};
  margin-left: ${(props) => props.left};
`;

Margin.defaultProps = {
  top: "0px",
  right: "0px",
  bottom: "0px",
  left: "0px"
};

export default Margin;