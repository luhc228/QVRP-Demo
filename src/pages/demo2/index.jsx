import * as React from "react";
import Button from "antd/lib/button";
import { Input, Table, Alert, Divider } from "antd";
import axios from "axios";
import qs from "qs";
import "./index.css";
import "../../utils/text.css";

const { TextArea } = Input;

export default class Demo2 extends React.Component {
  constructor() {
    super();
    this.state = {
      textForJudge: "",
      isJudging: false
    };
  }

  judgeColumns = [
    {
      title: "positive",
      dataIndex: "pos",
      key: "pos",
      render: (text, record, index) => {
        text = (text * 100).toFixed(5);
        const { pos, neg, neutral } = record;
        return pos > neg && pos > neutral ? (
          <div style={{ color: "red", fontWeight: "bold" }}>{text}%</div>
        ) : (
          <div>{text}%</div>
        );
      }
    },
    {
      title: "negative",
      dataIndex: "neg",
      key: "neg",
      render: (text, record, index) => {
        const { pos, neg, neutral } = record;
        text = (text * 100).toFixed(5);
        return neg > pos && neg > neutral ? (
          <div style={{ color: "red", fontWeight: "bold" }}>{text}%</div>
        ) : (
          <div>{text}%</div>
        );
      }
    },
    {
      title: "neutral",
      dataIndex: "neutral",
      key: "neutral",
      render: (text, record, index) => {
        const { pos, neg, neutral } = record;
        text = (text * 100).toFixed(5);
        return neutral > pos && neutral > neg ? (
          <div style={{ color: "red", fontWeight: "bold" }}>{text}%</div>
        ) : (
          <div>{text}%</div>
        );
      }
    }
  ];

  /**
   * @description
   *
   * @param {text}
   */
  loadTextToJudge = text => {
    let proxyUrl = "https://cors-anywhere.herokuapp.com/",
      targetUrl = "http://text-processing.com/api/sentiment/";

    this.setState({ isJudging: true });

    axios
      .post(
        proxyUrl + targetUrl,
        qs.stringify({
          text: text,
          language: "english"
        })
      )
      .then(response => {
        this.setState({
          sentimentData: response.data,
          isJudging: false
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({ isJudging: false });
      });
  };

  render() {
    return (
      <div style={{ padding: 24, background: "#fff", textAlign: "center" }}>
        <Alert
          style={{ margin: "0 0 2rem 0", textAlign: "left", width: "100%" }}
          message="Demo2: Descriptive text sentiment analysis"
        />
        <Divider orientation="left">Control Panel</Divider>
        <p className="text-small">
          According to the emotions contained in the text, we analyze the
          evaluation of the dishes when the guests eat that. Please type any
          texts in the area below, and click the
          <strong> Click to Judge</strong> button to analyse the sentiments.
        </p>
        <TextArea
          style={{ width: "80%", marginTop: "1rem" }}
          placeholder="Please enter a description for the food image (e.g, Wow! the sushi looks delicious!) "
          autosize={{ minRows: 3, maxRows: 6 }}
          onChange={e => this.setState({ textForJudge: e.target.value })}
        />

        <Button
          loading={this.state.isJudging}
          type="secondary"
          style={{ width: "80%", marginTop: "1.5rem", marginBottom: "1.5rem" }}
          onClick={() => {
            this.loadTextToJudge(this.state.textForJudge);
            this.setState({
              isJudging: true
            });
          }}
        >
          Click to Judge
        </Button>
        <p className="text-small">
          Please wait a few seconds to see the tested results.
        </p>
        <br />
        <Divider orientation="left">Tested Results</Divider>
        <p className="text-small">
          With the LinearSVC from sklearn, we can get a total test accuracy:{" "}
          <strong>80.1013024602%</strong>, here are the results:
        </p>
        {this.state.sentimentData ? (
          <div>
            <Table
              style={{
                marginTop: "1rem",
                marginLeft: "10%",
                marginRight: "10%"
              }}
              rowKey={record => record.pos}
              dataSource={[this.state.sentimentData.probability]}
              columns={this.judgeColumns}
              pagination={false}
              bordered
            />
            <div
              style={{
                marginTop: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <div style={{ margin: "10px 20px 0 0" }}>
                The test result is: {this.state.sentimentData.label}
              </div>
              {this.state.sentimentData.label === "neg" && (
                <img
                  style={{ width: 30, height: 30 }}
                  src="https://i.loli.net/2019/06/12/5d00aceccf1b942555.png"
                  alt="neg.png"
                  title="neg.png"
                />
              )}
              {this.state.sentimentData.label === "neutral" && (
                <img
                  style={{ width: 30, height: 30 }}
                  src="https://i.loli.net/2019/06/12/5d00aced39c7285310.png"
                  alt="neutral.png"
                  title="neutral.png"
                />
              )}
              {this.state.sentimentData.label === "pos" && (
                <img
                  style={{ width: 30, height: 30 }}
                  src="https://i.loli.net/2019/06/12/5d00aced3bad530244.png"
                  alt="pos.png"
                  title="pos.png"
                />
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
