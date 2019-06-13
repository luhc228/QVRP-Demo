import * as React from "react";
import "../../utils/text.css";

export default class System extends React.Component {
  render() {
    return (
      <div style={{ padding: 24, background: "#fff", textAlign: "center" }}>
        <p className="title">1. Our System</p>
        <p className="subtitle">1.1 Build A Better Dataset</p>
        <p className="text">
          The most important task for our system is{" "}
          <strong>clean and tag the dirty pictures from Instagram</strong>.
          Because the most important method for improving the accuracy of a DL
          system is to improve the quality of data. Raw data from instagram is
          very data dirty, means we can not apply that directly to our training
          algorithm (will get a bad result).
        </p>
        <p className="text">
          So, the first and the most improtant thing is to clean and tag the
          data from instagram. We can divide our data into two part:
        </p>
        <p className="text">
          &nbsp; <strong>1. Food Images</strong>
          <br /> &nbsp; <strong>2. Food Descriptions</strong>
        </p>
        <p style={{ textAlign: "center" }}>
          <br />
          <img
            src="https://i.loli.net/2019/06/13/5d0223af6dade74774.png"
            style={{ width: "90%" }}
          />
        </p>
        <p className="text">
          By using the system above (I built two demos and get the baselines
          with the system), we can get two new features of data:
        </p>
        <p className="text">
          <strong>&nbsp;1. Food Kind</strong>
          <br /> &nbsp;
          <strong>2. Food Evaluation, Tags (Pos, Neg or Nor)</strong>
        </p>
        <p className="text">So our new dataset looks like: </p>
        <p className="code-block">
          Data = (Images ... , Comment ..., Kind, Evaluation)
        </p>
        <p className="text">
          This is what we want to get. Using this kind of data, we can do our
          next step: <strong>improve our recommended system.</strong>
        </p>
        <br />
        <p className="subtitle">1.2 Design A Better System</p>
        <p className="text">A better system may looks like this:</p>
        <p style={{ textAlign: "center" }}>
          <br />
          <img
            src="https://i.loli.net/2019/06/13/5d02267fdb55d95089.png"
            style={{ width: "90%" }}
          />
        </p>
        <p className="text">
          This is our final system, the entire system can be divided into two
          parts: the data cleaning part and the classification part. The data
          cleaning part is the most important, it determines the accuracy of the
          algorithm to identify the picture. After we get a clean, hight quality
          dataset, then we can use the cleaned and processed data for the next
          classification model training.
        </p>
        <p className="text">
          This is a{" "}
          <strong>very large machine learning engineering system</strong>, which
          involves three parts:{" "}
          <strong>data acquisition, cleaning and final classification</strong>.
          At the same time, the deep learning part can be further divided into
          computer vision recognition food type part, natural language
          processing part and final classifier part. So this system is
          definitely not short-term achievable, but some design ideas about this
          system will be documented in this document.
        </p>

        <br />
        <p className="subtitle">1.3 Website Demo</p>
        <p className="text">
          In order to verify the feasibility of this system, I made a data
          collection and classification demo. Just enter a photo of the food and
          a comment of the food, the system will guess the type of food (from
          101 known foods) and give the emotions in the comments (positive,
          negative or general).
        </p>
        <p className="text">
          I deployed this deep learning system to a website that anyone can
          access and does not have commercial use. This website can serve as a
          way for us to clean and tag the data collected on Instagram. Also,
          this proves that our design ideas are correct, and you can freely
          upload images of food for testing to verify the accuracy of the
          software. The demos can be found in this site, please enjoy yourself.
        </p>
        <p style={{ textAlign: "center" }}>
          <br />
          <img
            src="https://i.loli.net/2019/06/13/5d0228133727d72543.png"
            style={{ width: "90%" }}
          />
        </p>
      </div>
    );
  }
}
