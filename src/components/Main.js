import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import firebase from './../utils/libs/firebase';
import App from './App'

export default class Main extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = { message: '', studiedSeconds: 0, studyTimes: [] }

        this.tick = this.tick.bind(this);
        this.saveStudyTime = this.saveStudyTime.bind(this);
        this.getStudytimes = this.getStudytimes.bind(this);
    }

    async componentDidMount() {
      const user = await firebase.auth().onAuthStateChanged();

      if (!user) {
        const rootElement = await document.getElementById("root");
        await ReactDOM.render(<App />, rootElement);
      } else {
        this._mounted = true
        this.interval = setInterval(this.tick, 1000);
        this.getStudytimes();
      }
    }

    componentWillUnmount () {
      this._mounted = false
      clearInterval(this.interval);
    }

    async getStudytimes() {
      const token = await firebase.auth().currentUser.getIdToken();

      if (token) {
        const response = await axios.get('http://localhost:3003/api/v1/studytime', 
        {headers: { authorization: `Bearer ${token}` }})

        this.setState({ studyTimes: response.data })
      }
    }

    tick(e) {
      if(this._mounted) {
        this.setState({studiedSeconds: this.state.studiedSeconds + 1});
      }
  }

    async saveStudyTime(e) {
      e.preventDefault();

      const self = this;

      var now = new Date();

      var yyyymmdd = now.getFullYear()+
          ( "0"+( now.getMonth()+1 ) ).slice(-2)+
          ( "0"+now.getDate() ).slice(-2);

      const token = await firebase.auth().currentUser.getIdToken();
      if (token) {

        axios.post('http://localhost:3003/api/v1/studytime', {
            date: yyyymmdd,
            studytime: self.state.studiedSeconds
          }, {headers: { authorization: `Bearer ${token}` }})
          .then(function (response) {
            console.log(response);
            self.setState({ message: 'Well Done!' });
            clearInterval(self.interval);
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        alert("cant get userIdToken")
      }
    }

  render() {
    var totalStudiedTime = 0;
    this.state.studyTimes.map((studyTime) => {
      return totalStudiedTime += Number(studyTime.studytime);
    });

    return (
      <div>
        <h1>Do Study!!!</h1>

        <div data-testid="message">{this.state.message}</div>

        <div data-testid="DefaultTimer">{this.state.studiedSeconds}seconds</div>

        <form onSubmit={this.saveStudyTime}>
            <div>
              <button type="submit">
                End!
              </button>
            </div>
        </form>

        <h2>You've studieds {totalStudiedTime} seconds!</h2>

        {(() => {
          if (this.state.studyTimes.length > 0) {
            return (
              <table data-testid="studytime-list">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Studied Times(s)</th>
                  </tr>
                </thead>
                <tbody>
                {this.state.studyTimes.map((studyTime, index) => {
                  return (
                    <tr key={index}>
                      <td>{studyTime.date}</td>
                      <td>{studyTime.studytime}</td>
                    </tr>
                    )
                  })}
                </tbody>
              </table>
            )
          } else {
            return <span>You haven't studied!</span>
          }
        })()}
      </div>
    );
  }
}
