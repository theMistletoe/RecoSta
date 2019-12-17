import React from "react";

export default class SignUp extends React.Component {
  
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentWillUnmount () {

    }

  render() {

    return (
      <div>
        <h1>SignUp Your Account!</h1>
        <form>
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
