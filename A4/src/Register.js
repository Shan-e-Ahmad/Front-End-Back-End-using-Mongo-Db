import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "./App.css";

<link rel="stylesheet" href="login.css" />;

class Register extends Component {
  state = {
    response: "",
    post: "",
    responseToPost: "",
    username: "",
    password: "",
    redirect: null,
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    });

    const body = await response.text();
    const message = JSON.parse(body).message;
    this.setState({ responseToPost: message });

    if (message == "User created!") {
      this.setState({ redirect: "/login" });
    } else {
      this.setState({ redirect: null });
    }
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div className="App">
        <div className="logo">
          <img src="freelancer.jpg" alt="logo" />
        </div>
        <div>
          Sign-Up
          <br />
          <br />
          <form onSubmit={this.handleSubmit}>
            <div>
              Username
              <br />
              <input
                type="text"
                onChange={(e) => this.setState({ username: e.target.value })}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              Password
              <br />
              <input
                type="password"
                onChange={(e) => this.setState({ password: e.target.value })}
              />
            </div>

            <br />
            <button type="submit">Join Freelancer</button>
          </form>
          <p>{this.state.responseToPost}</p>
          <br />
        </div>
      </div>
    );
  }
}

export default Register;
