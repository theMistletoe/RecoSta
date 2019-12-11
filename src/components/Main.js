import React from "react";
import axios from "axios";
import EasyTimer from "../../node_modules/easytimer.js";
import firebase from './../utils/libs/firebase';

export default class Main extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = { message: '', timer: new EasyTimer(), timeValues: "" }

        this.tick = this.tick.bind(this);
        this.saveStudyTime = this.saveStudyTime.bind(this);
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

    tick(e) {
      let { timer } = this.state;
      const timeValues = timer.getTimeValues().toString();
      if(this._mounted) {
        this.setState({ timeValues: timeValues });
      }
  }

    async saveStudyTime(e) {
      e.preventDefault();

      const self = this;
      let { timer } = self.state;
      let { timeValues } = self.state;
      timer.stop();

      var now = new Date();

      var yyyymmdd = now.getFullYear()+
          ( "0"+( now.getMonth()+1 ) ).slice(-2)+
          ( "0"+now.getDate() ).slice(-2);

      const token = await firebase.auth().currentUser.getIdToken();
      if (token) {

        axios.post('http://localhost:3003/api/v1/studytime', {
            date: yyyymmdd,
            studytime: timeValues
          }, {headers: { authorization: `Bearer ${token}` }})
          .then(function (response) {
            console.log(response);
            self.setState({ message: 'Well Done!' });
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        alert("cant get userIdToken")
      }
    }

  render() {
    return (
      <div>
        <h1>Do Study!!!</h1>

        <div data-testid="message">{this.state.message}</div>

        <div data-testid="DefaultTimer">{this.state.timeValues}</div>

        <form onSubmit={this.saveStudyTime}>
            <div>
              <button type="submit">
                End!
              </button>
            </div>
        </form>
      </div>
    );
  }
}
