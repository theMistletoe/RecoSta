import React from "react";
import axios from "axios";
import EasyTimer from "../../node_modules/easytimer.js";

export default class Main extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = { user: "", url: "", inputName: "", timer: new EasyTimer(), timeValues: "" }

        this.tick = this.tick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.fetchGitHubInfo = this.fetchGitHubInfo.bind(this);
    }

    componentDidMount() {
      this._mounted = true
      let { timer } = this.state;
      timer.start();
      timer.addEventListener("secondsUpdated", this.tick);
    }

    componentWillUnmount () {
      this._mounted = false
    }

    handleChange(e) {
      this.setState({inputName: e.target.value});
    }
    
    tick(e) {
      let { timer } = this.state;
      const timeValues = timer.getTimeValues().toString();
      if(this._mounted) {
        this.setState({ timeValues: timeValues });
      }
  }

    async fetchGitHubInfo(e) {
      e.preventDefault();
      
      const response = await axios.get(`https://api.github.com/users/${this.state.inputName}`)
      this.setState({user: response.data.login})
      this.setState({url: response.data.html_url})
    }

  render() {
    return (
      <div>
        <h1>Do Study!!!</h1>
        <div data-testid="DefaultTimer">{this.state.timeValues}</div>
        <form onSubmit={this.fetchGitHubInfo}>
            <div>
                <label>
                    Name:
                    <input type="text" placeholder="Input GitHub Name" value={this.state.inputName} onChange={this.handleChange}></input>
                </label>
            </div>
            
            <div>
              <button type="submit">
                End!
              </button>
            </div>
        </form>
        <ul>
          <li data-testid="name">{this.state.user}</li>
          <li data-testid="url">{this.state.url}</li>
        </ul>
      </div>
    );
  }
}
