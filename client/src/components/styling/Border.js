import styled from 'styled-components';

const Border = styled.div`
  border-top: ${(props) => props.top} solid ${(props) => props.color};
  border-right: ${(props) => props.right} solid ${(props) => props.color};
  border-bottom: ${(props) => props.bottom} solid ${(props) => props.color};
  border-left: ${(props) => props.left} solid ${(props) => props.color};
`;

Border.defaultProps = {
  top: "0px",
  right: "0px",
  bottom: "0px",
  left: "0px",
  color: "#c9d2db"
};

export default Border;