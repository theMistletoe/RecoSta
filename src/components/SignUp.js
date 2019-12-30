import React from "react";
import axios from "axios";

import Button from "./styling/Button";
import Padding from "./styling/Padding";
import InlineWrapper from "./styling/InlineWrapper"
import Wrapper from "./styling/Wrapper";
import Input from "./styling/Input";
import Text from "./styling/Text";
import Form from "./styling/Form";
import H1 from "./styling/H1";
import Header from "./Header";
import Footer from "./Footer";

export default class SignUp extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        email:"",
        password:""
      }

      this.handleChange = this.handleChange.bind(this);
      this.handleSignUp = this.handleSignUp.bind(this);
    }

    handleChange = (event) => {
      this.setState({[event.target.name]: event.target.value})
    }

    handleSignUp = (event) => {
      event.preventDefault();

      axios.post('http://localhost:3003/api/v1/auth/signup', {
        email: this.state.email,
        password: this.state.password
      })
      .then(function (response) {
        console.log(response);
        alert('Account Verification Mail has been sent!');
      })
      .catch(function (error) {
        console.log(error);
        alert(`Some Error Occured!:\n${error}`);
      });
    }

  render() {

    return (
      <div>
        <Padding bottom={40}>
          <Header />
        </Padding>
        <Wrapper>
          <H1>SignUp<br />Your Account!</H1>
          <Form onSubmit={this.handleSignUp}>
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
              <Button type="submit">SignUp</Button>
            </Padding>
          </Form>
        </Wrapper>
        <Footer />
      </div>
    );
  }
}
