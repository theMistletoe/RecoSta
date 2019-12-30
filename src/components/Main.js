import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import firebase from './../utils/libs/firebase';

import App from './App'
import Header from "./Header";
import Footer from "./Footer";

import Button from "./styling/Button";
import Padding from "./styling/Padding";
import Margin from "./styling/Margin";
import Wrapper from "./styling/Wrapper";
import Text from "./styling/Text";
import Strong from "./styling/Strong";
import Form from "./styling/Form";
import H1 from "./styling/H1";
import Hr from "./styling/Hr";
import Table from "./styling/Table/Table"
import Th from "./styling/Table/Th"
import Td from "./styling/Table/Td"

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
          <Strong fs="50px" color="#ff1453" data-testid="message">{this.state.message}</Strong>

          <Form onSubmit={this.saveStudyTime}>
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
                  <Table data-testid="studytime-list">
                    <thead>
                      <tr>
                        <Th>Date</Th>
                        <Th>Studied Times(s)</Th>
                      </tr>
                    </thead>
                    <tbody>
                    {this.state.studyTimes.map((studyTime, index) => {
                      return (
                        <tr key={index}>
                          <Td>{studyTime.date}</Td>
                          <Td>{studyTime.studytime}</Td>
                        </tr>
                        )
                      })}
                    </tbody>
                  </Table>
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
