import React, { Component } from "react";
import ReactDom from "react-dom";
const styles = {
  box: {
    width: '350px',
    border: "solid thin gray",
    left: "37%",
    padding: "10px",
    position: "relative",
    margin: "15px"
  },
  loading: {
    backgroundColor: "aquamarine",
    padding: "10px",
    width: "350px",
    left: "34%",
    position: "relative",
    margin: "52px"
  }
}
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      total: 6,       //total of amount of data units allowed
      currentCount: 0, //current amount of data units in the application
      offset: 3,      //data units allowed per request on updates
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
      let currcount = this.state.currentCount - this.state.offset;
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
      this.setState({ isFetching: false, currentCount: currcount, list: nl });//dont for get to add push or unshift
      
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
      let currcount = this.state.currentCount - this.state.offset;
      let nl = this.state.list;
      
      // shift by offset 
      for (let i = 0; i < this.state.offset; i++) {
        nl.shift();
      }
      //dont forget to pop or shift
      data = JSON.parse(data);
      console.log("data was retrieved", data)
      let d = data.data;      
      for (let i = 0; i < d.length; i++) {
        nl.push(d[i]);        
      }
      this.setState({ isFetching: false, currentCount: currcount, list: nl });//dont for get to add push or unshift

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
    let isAtTop = window.pageYOffset === 0 ? true : false;/*or $(window).height() */
    // find if the scroll has passed the limit of the state.total
    // if so add the excess by a unit of a state.offset
    let excess ;
    if (isAtTop) {
      console.log("top")
      excess  = this.state.currentCount + this.state.offset;
    } else if (isAtEnd) {
      console.log(" bottom")
      excess = this.state.currentCount + this.state.offset;
    }
    // console.log("isAtEnd", isAtEnd);
    //User at the end of content. load more content
    if (excess > this.state.total) {
        console.log("excess",excess);
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
      if(isAtTop || isAtEnd){
        this.setState({ isFetching: true });
        setTimeout(this.addData, 1000)};
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

  loadInitialContent() {
    // this.getContentFromServer(this.state.offset)
    // console.log("loading inital content");

    // console.log("this.state.offset *82", this.state.offset * 82, "window.innerHeight", window.innerHeight)
    if ((this.state.offset * 82) < window.innerHeight) {
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
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React infinite initalzation</h2>
        </div>
        <div className="App-intro">
          {
            this.state.list.map((item, index) => (
              <div style={styles.box} key={index}>
                <img width="350" />
                <h3 style={{ margin: 0 }}>name: {item.name}</h3>
                <h3 style={{ margin: 0 }}>email:{item.email}</h3>
                <p style={{ color: 'gray', textAlign: "center" }}>address: {item.address}</p>
              </div>
            ))
          }
          {
            // (this.state.currentCount !== this.state.total) ?
              <div id="content-end" style={styles.loading} onClick={e => this.forceLoadOnScroll()}>
                Please wait. Loading...
            </div> 
            // : null
          }

        </div>
      </div>
    );
  }

}

export default App;

const fullList = [
  {
    id: 1,
    title: "Title 1",
    summary: "The aim of this project is to design a car using fuel cell technology.",
    pic: "1.jpg"
  },
  {
    id: 2,
    title: "Title 2",
    summary: "The aim of this project is to design a car using fuel cell technology.",
    pic: "2.jpg"
  },
  {
    id: 3,
    title: "Title 3",
    summary: "The aim of this project is to design a car using fuel cell technology.",
    pic: "3.jpg"
  },
  {
    id: 4,
    title: "Title 4",
    summary: "The aim of this project is to design a car using fuel cell technology.",
    pic: "4.jpg"
  },
  {
    id: 5,
    title: "Title 5",
    summary: "The aim of this project is to design a car using fuel cell technology.",
    pic: "5.jpg"
  },
  {
    id: 6,
    title: "Title 6",
    summary: "The aim of this project is to design a car using fuel cell technology.",
    pic: "6.jpg"
  },
  {
    id: 7,
    title: "Title 7",
    summary: "The aim of this project is to design a car using fuel cell technology.",
    pic: "7.jpg"
  },
  {
    id: 8,
    title: "Title 8",
    summary: "The aim of this project is to design a car using fuel cell technology.",
    pic: "8.jpg"
  },
  {
    id: 9,
    title: "Title 9",
    summary: "The aim of this project is to design a car using fuel cell technology.",
    pic: "9.jpg"
  },
  {
    id: 10,
    title: "Title 10",
    summary: "The aim of this project is to design a car using fuel cell technology.",
    pic: "10.jpg"
  },
  {
    id: 11,
    title: "Title 11",
    summary: "The aim of this project is to design a car using fuel cell technology.",
    pic: "11.jpg"
  },
  {
    id: 12,
    title: "Title 12",
    summary: "The aim of this project is to design a car using fuel cell technology.",
    pic: "12.jpg"
  },
]

ReactDom.render(<App />, document.getElementById("app"));