import React from "react";
import ReactDOM from "react-dom";
import Main from "./Main";
import SignUp from "./SignUp";
import auth from "../utils/libs/firebaseAuth";
import Button from "./styling/Button";
import Padding from "./styling/Padding";
import InlineWrapper from "./styling/InlineWrapper"
import Wrapper from "./styling/Wrapper";
import Input from "./styling/Input";
import Text from "./styling/Text";
import Form from "./styling/Form";
import H1 from "./styling/H1";

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email:"",
            password:""
        }
        this.handleLogin = this.handleLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderSignUp = this.renderSignUp.bind(this);
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
      }

    async handleLogin(event) {
        event.preventDefault();

        try {
            await auth.signInWithEmailAndPassword(this.state.email, this.state.password);

            const rootElement = document.getElementById("root");
            ReactDOM.render(<Main />, rootElement);
        } catch (error) {
            alert(error);
        }
      }

    async renderSignUp(event) {
        event.preventDefault();

        const rootElement = document.getElementById("root");
        ReactDOM.render(<SignUp />, rootElement);
    }

  render() {
    return (
      <Wrapper>
        <Padding top={30}>
            <H1>Record Your <br />Study Times!</H1>
        </Padding>

        <Form onSubmit={this.handleLogin}>
            <Padding left={10}>
                <InlineWrapper>
                    <Text>email:</Text>
                </InlineWrapper>
                <InlineWrapper>
                    <Padding left={10}>
                        <Input type="text" name="email" placeholder="Input Your Email Address" onChange={this.handleChange}></Input>
                    </Padding>
                </InlineWrapper>
            </Padding>

            <Padding left={10}>
                <InlineWrapper>
                    <Text>password:</Text>
                </InlineWrapper>
                <InlineWrapper>
                    <Padding left={10}>
                        <Input type="password" name="password" placeholder="Password" onChange={this.handleChange}></Input>
                    </Padding>
                </InlineWrapper>
            </Padding>

            <Padding top={30}>
                    <Button primary type="submit">Login</Button>
                    <Button onClick={this.renderSignUp}>SignUp</Button>
            </Padding>
        </Form>
      </Wrapper>
    );
  }
}
