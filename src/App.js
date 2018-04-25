import React, { Component } from "react";
import ReactDom from "react-dom";

import {pages} from "./styless.css";
const styles = {
  r:{
    align:"center",
    marginTop: "35px",
    border: "solid thin gray",
  },
  f:{
    position: "fixed",
    border:'1px solid black',
    backgroundColor: "grey",    
    width:"100%",
    height:"30px",
    // font:"5px",
    margin:"0px 0px 0px 0px",
    display: "block",
    textAlign:'center'


  },
  body:{
    padding:'0px',
    margin: "0px"
  },
  table:{

    padding:'0px',
    display: "table",
    width:"100%",
    margin: "0px"
  },
  box: {
    width: '400px',
    border: "solid thin gray",
    // left: "37%",
    padding: "10px",
    // position: "relative",
    margin: "20px",
    align:"center"
  },
  loading: {
    backgroundColor: "aquamarine",

  }
}
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      total: 1000,       //total of amount of data units allowed
      currentCount: 0, //current amount of data units in the application
      offset: 500,      //data units allowed per request on updates
      list: [],       //data structure to hold all data units
      isFetching: false // if there is a xmlhttprequest happening
    }
    this.loadOnScroll = this.loadOnScroll.bind(this);
    this.loadInitialContent = this.loadInitialContent.bind(this);
    this.getContentFromServer = this.getContentFromServer.bind(this);
    this.addTopData = this.addTopData.bind(this);
    this.addBottomData = this.addBottomData.bind(this);
    this.addData = this.addData.bind(this);

    console.log("this.state", this.state);
  }

  componentWillMount() {

 

    this.loadInitialContent();  //set up the inital data in th application according the state properties
  }
  componentDidMount() {
    window.addEventListener('scroll', this.loadOnScroll); // detect and updated the entire application in scroll
    
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.loadOnScroll);//remove the scroll up render because without our application runs into errors
  }


  forceLoadOnScroll() { //future update to the application

  }

  addTopData() {
    console.log("adding data at the top");

    let gEvents = (resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", "http://localhost:3001/data/" + this.state.offset, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({ status: this.status, statusText: xhr.statusText });
        }
      }
      xhr.send();
    }
    let p = new Promise(gEvents);
    p.then((data) => {
      data = JSON.parse(data);
      console.log("data was retrieved", data)
      this.setState({ isFetching: true });
      // decrement current count by offset
      
      let d = data.data;
      let nl = this.state.list;
      //pop off offset
      //dont forget to pop or shift
      for (let i = 0; i < this.state.offset; i++) {
        nl.pop();
      }
      // unshift returned data to the stack list 
      for (let i = 0; i < d.length; i++) {
        nl.unshift(d[i]);
      }

      // set state retch to false currcount list unshift
      this.setState({ isFetching: false,  list: nl });//dont for get to add push or unshift

    }).catch((err) => {
      console.log("err", err);
    });

  }

  addBottomData() {
    console.log("adding data at the bottom");
    let gEvents = (resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", "http://localhost:3001/data/" + this.state.offset, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({ status: this.status, statusText: xhr.statusText });
        }
      }
      xhr.send();
    }
    let p = new Promise(gEvents);
    p.then((data) => {
      this.setState({ isFetching: true });
      // let currcount = this.state.currentCount - this.state.offset;
      // console.log("add bottom curcount", this.state.currentCount,"diff", currcount );
      let nl = this.state.list;
      console.log("nl",nl.length)
      // shift by offset 
      for (let i = 0; i < this.state.offset; i++) {
        nl.shift();
      }
      console.log("nl",nl.length)
      //dont forget to pop or shift
      data = JSON.parse(data);
      console.log("add bottomdata was retrieved", data)
      let d = data.data;
      for (let i = 0; i < d.length; i++) {
        nl.push(d[i]);
      }
      console.log("add bottom  nl had been pushed", nl);
      // console.log("add bottom count is now ", currcount);
      this.setState({ isFetching: false,  list: nl });//dont for get to add push or unshift

    }).catch((err) => {
      console.log("err", err);
    });

  }

  addData() {

    console.log("adding data");

    let gEvents = (resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", "http://localhost:3001/data/" + this.state.offset, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({ status: this.status, statusText: xhr.statusText });
        }
      }
      xhr.send();
    }
    let p = new Promise(gEvents);
    p.then((data) => {
      data = JSON.parse(data);
      console.log("data was retrieved", data)
      let currcount = this.state.currentCount + this.state.offset;
      //dont forget to pop or shift

      let d = data.data;
      let nl = this.state.list;
      for (let i = 0; i < d.length; i++) {
        nl.push(d[i]);
      }
      this.setState({ isFetching: false, currentCount: currcount, list: nl });//dont for get to add push or unshift

    }).catch((err) => {
      console.log("err", err);
    });

  }

  getContentFromServer(offset) {

    let gEvents = (resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", "http://localhost:3001/data/" + offset, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({ status: this.status, statusText: xhr.statusText });
        }
      }
      xhr.send();
    }
    let p = new Promise(gEvents);
    p.then((data) => {
      data = JSON.parse(data);
      console.log("data was retrieved", data)

    }).catch((err) => {
      console.log("err", err);
    });

  }
 
  loadOnScroll(e) {
    // console.log("this.state.currentCount", this.state.currentCount == this.state.total);
    // console.log(window.pageYOffset);
    // update only when the application is not fetching for data
    if (this.state.isFetching) return;

    //get the position of the last dom element in the application
    let el = document.getElementById('content-end');
    let rect = el.getBoundingClientRect();
    // determine if the scroll is at the bottom of the window
    let isAtEnd = (
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)  /*or $(window).height() */
    );
    // determine if the scroll is back at the top of the window
    let isAtTop = window.pageYOffset < 5  ? true : false;/*or $(window).height() */
    
    // find if the scroll has passed the limit of the state.total
    // if so add the excess by a unit of a state.offset
    // keep the scroll bar from staying at the exact bottom or top since we
    // need for the user to keep scroll up or down
    let excess;
    if (isAtTop) {
      // console.log("top")
      excess = this.state.currentCount + this.state.offset;
      let newDis = window.pageYOffset+20;
      // console.log("newDis", newDis);
      window.scroll(window.pageXOffset, newDis);

    } else if (isAtEnd) {
      // console.log(" bottom")
      excess = this.state.currentCount + this.state.offset;
      let newDis = window.pageYOffset-20;
      // console.log("newDis", newDis);
      window.scroll(window.pageXOffset, newDis);
    }
    // console.log("isAtEnd", isAtEnd);
    //User at the end of content. load more content
    if (excess > this.state.total) {
      console.log("excess", excess);
      if (isAtTop) {
        // console.log("I am at the top")
        this.setState({ isFetching: true });
        this.addTopData();

      } else if (isAtEnd) {
        // console.log("I am at the bottom")
        this.setState({ isFetching: true });
        this.addBottomData();
      }


    } else {
      if (isAtTop || isAtEnd) { //add data to the application we you ahave reached the ends
        this.setState({ isFetching: true });//set fetch to true so that overwhelm the application with request
        setTimeout(this.addData, 1000) //
      };
    }


    // if (!this.state.isFetching) {

    //   this.setState({ isFetching: true });

    //   //get content from server
    //   setTimeout(() => {
    //     var count = this.state.currentCount + this.state.offset
    //     if (this.state.currentCount !== this.state.total) {
    //       this.setState({
    //         isFetching: false,
    //         currentCount: count,
    //         list: fullList.slice(0, count)
    //       })
    //     }
    //   }, 3000);

    // }

    return
  }

  loadInitialContent() { //get a unit if data and render the inital data
    // this.getContentFromServer(this.state.offset)
    // console.log("loading inital content");
     
    this.addData();
    console.log("this.state.offset *82", this.state.offset * 183, "window.innerHeight", window.innerHeight)
    if ((this.state.offset * 183) < window.innerHeight) {// check the height to window and check if it needs more data to full the window
      if (!this.state.isFetching) {

        this.setState({ isFetching: true });

        //get content from server
        this.addData();

        // setTimeout(() => {
        //   var count = this.state.currentCount + this.state.offset
        //   if (this.state.currentCount !== this.state.total) {
        //     this.setState({
        //       isFetching: false,
        //       currentCount: count,
        //       list: fullList.slice(0, count)
        //     })
        //   }
        // }, 3000);

      }
    }
    //Get content from server using your preferred method (like AJAX, relay)
    // let ary = fullList.slice(0, this.state.offset);
    // this.setState({ list: ary });
  }
  render() {
    return (
    <table style={styles.table}>
        <tbody style={styles.body} >
            <tr style={styles.f}>
               <td style={styles.f}>
                {/* <h2 className="App-header">Welcome to React infinite initalzation</h2> */}
                Welcome to React infinite initalzation
                </td>
            </tr>
              {
                
                this.state.list.map((item, index) => (
                <tr  key={index}>
              <td >    
                      <div style={styles.r} >
                        <img width="350" />
                        <h3 style={{ margin: 0 }}>name: {item.name}</h3>
                        <h3 style={{ margin: 0 }}>email:{item.email}</h3>
                        <p style={{ color: 'gray', textAlign: "center" }}>address: {item.address}</p>
                      </div>
               </td>
            </tr>     
                ))
              }
                {/* <h2 className="App-header">Welcome to React infinite initalzation</h2> */}
            <tr><td> 
            {
              // (this.state.currentCount !== this.state.total) ?
              <div id="content-end" style={styles.loading} onClick={e => this.forceLoadOnScroll()}>
                Please wait. Loading...
          </div>
              // : null
            }
            </td></tr>
            </tbody>
    </table>            
      // <div className="App">
      //   <div className="App-intro">              
           
      //   </div>
      // </div>
      
    );
  }

}

export default App;



ReactDom.render(<App />, document.getElementById("app"));