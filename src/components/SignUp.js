import React from "react";
import axios from "axios";

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
      });
    }

  render() {

    return (
      <div>
        <h1>SignUp Your Account!</h1>
        <form onSubmit={this.handleSignUp}>
          <div>
            <label>
              email:
              <input type="text" name="email" placeholder="Input Your Email Address" onChange={this.handleChange}></input>
            </label>
          </div>

          <div>
            <label>
              password:
              <input type="password" name="password" placeholder="Password" onChange={this.handleChange}></input>
            </label>
          </div>

          <div>
            <button type="submit">SignUp</button>
          </div>
        </form>
      </div>
    );
  }
}
