import React from "react";
import "./TrumpCard.css";

const TrumpCard = props => (
  <div className="card">
    <div className="img-container">
      {/* <img alt={props.scandal} src={props.url} /> */}
      <img src={props.url} alt={props.scandal} data-id={props.id}/>
    </div>


  </div>
);

export default TrumpCard;
