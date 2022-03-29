import React, { Component } from "react";
import "./App.css";

class dashboard extends Component {
  state = {
    response: "",
    post: "",
    responseToPost: "",
    people: [],
    redirect: null,
  };
  componentDidMount() {
    this.callApi()
      //.then((res) => this.setState({ response: res.express }))
      .then((res) => this.setState({ people: res.posts }))
      .catch((err) => console.log(err));
  }
  callApi = async () => {
    const response = await fetch("/api/getList");
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/refreshData");
    this.callApi()
      .then((res) => this.setState({ people: res.posts }))
      .catch((err) => console.log(err));
  };
  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <br />
          <button type="submit">Refresh Data</button>
        </form>
        {this.state.people.map((item) => (
          <div key={item.id}>
            <div className="credits text-center" n>
              <div>
                <a
                  href=" "
                  data-qtsb-section="page-job-search-new"
                  data-qtsb-subsection="card-job"
                  data-qtsb-label="link-project-title"
                  data-heading-link="true"
                >
                  {item.heading}
                </a>

                <span>{item.duration}</span>
              </div>

              <p>{item.description}</p>

              <a
                href=" "
                data-qtsb-section="page-job-search-new"
                data-qtsb-subsection="card-job"
                data-qtsb-label="link-skill"
              >
                {item.skills}
              </a>

              <div>{item.price}</div>
              <div>{item.bid}</div>
              <div></div>

              <hr />
            </div>{" "}
          </div>
        ))}
      </div>
    );
  }
}
export default dashboard;
