import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import firebase from './../utils/libs/firebase';
import App from './App'

import Button from "./styling/Button";
import Padding from "./styling/Padding";
import Margin from "./styling/Margin";
import Wrapper from "./styling/Wrapper";
import Text from "./styling/Text";
import Form from "./styling/Form";
import H1 from "./styling/H1";
import Hr from "./styling/Hr";
import Header from "./Header";
import Footer from "./Footer";

export default class Main extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = { message: '', studiedSeconds: 0, studyTimes: [] }

        this.tick = this.tick.bind(this);
        this.saveStudyTime = this.saveStudyTime.bind(this);
        this.getStudytimes = this.getStudytimes.bind(this);
      }
      
      componentDidMount() {
        this._mounted = true
        
        firebase.auth().onAuthStateChanged(function(user) {
          if (user && user.emailVerified && !user.disabled ) {
            // User is signed in.
          } else {
            // User is signed out.
            alert('You Have to Login!');
            const rootElement = document.getElementById("root");
            ReactDOM.render(<App />, rootElement);
          }
        });
        
        this.interval = setInterval(this.tick, 1000);
        this.getStudytimes();
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
        <Padding bottom={40}>
          <Header />
        </Padding>

        <Wrapper>
          <H1>Do Study!!!</H1>
          <H1>You've studieds {totalStudiedTime} seconds!</H1>

          <Form onSubmit={this.saveStudyTime}>
            <Text data-testid="message">{this.state.message}</Text>
            <Text data-testid="DefaultTimer">{this.state.studiedSeconds}seconds</Text>
            <Button type="submit">
              End!
            </Button>
          </Form>

          <Hr />

          <Margin left="auto" right="auto" width="235px">
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
          </Margin>
        </Wrapper>
        <Footer />
      </div>
    );
  }
}
