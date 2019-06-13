import * as React from "react";
import "../../utils/text.css";

export default class About extends React.Component {
  render() {
    return (
      <div style={{ padding: 24, background: "#fff", textAlign: "center" }}>
        <p className="subtitle">Thanks</p>
        <p className="text-small">
          This project tooks about a week to finish, thanks to Minh Chau, the
          CEO of <a ref="http://www.qathena.com/">Qathena</a>, who give me this
          chance to do such interesting thing, and I believe Qathena and it's
          idea will make a difference in the catering industry in the U.S.
        </p>
        <p className="text-small">
          I haven't touched the front-end development before, and I don't know
          much about the application of deep learning in engineering. Thanks to
          this opportunity, I have been able to exercise my skills in these
          aspects, And I believe that these experiences will help my future
          career development.
        </p>

        <p className="subtitle">About Me</p>
        <p className="text-small">
          I’m in my senior year at EECS bachelor program and have been studying
          computer science for two years out of my hobbies. I believe that
          technology changes life, and prefer to do some creative work compared
          to working in a big company.
        </p>
      </div>
    );
  }
}
