import React, { Component } from "react";
import TrumpCard from "./components/TrumpCard";
import Wrapper from "./components/Wrapper";
import Header from "./components/Header";
import scandals from "./scandals.json";
import "./App.css";


class App extends Component {
  // Setting this.state.scandals to the scandals json array
  state = {
    scandals
  };

  removeScandal = id => {
    // Filter this.state.scandals for scandals with an id not equal to the id being removed
    const scandals = this.state.scandals.filter(scandal => scandal.id !== id);
    // Set this.state.scandals equal to the new scandals array
    this.setState({ scandals });
  };

  // Map over this.state.scandals and render a scandalCard component for each scandal object
  render() {
    return (
      <Wrapper>
        <Header />
        {this.state.scandals.map(scandal => (
          <TrumpCard
            removescandal={this.removescandal}
            id={scandal.id}
            key={scandal.id}
            scandal={scandal.scandal}
            url={scandal.url}

          />
        ))}
      </Wrapper>
    );
  }
}

export default App;
