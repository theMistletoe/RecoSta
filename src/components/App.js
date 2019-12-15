import React from "react";
import ReactDOM from "react-dom";
import Main from "./Main";
import SignUp from "./SignUp";
import auth from "../utils/libs/firebaseAuth";

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
      <div>
        <h1>Login Page</h1>
        <form onSubmit={this.handleLogin}>
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
                <button type="submit">Login</button>
            </div>
        </form>

        <div>
            <button onClick={this.renderSignUp}>SignUp</button>
        </div>
      </div>
    );
  }
}
