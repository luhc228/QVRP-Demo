import React, { Component } from "react";
import Button from "antd/lib/button";
import { Progress, Divider, Input, Table, Row, Col, Tooltip } from "antd";
import { Alert } from "antd";
import axios from "axios";
import qs from "qs";
import "./App.css";

import ndarray from "ndarray";
import ops from "ndarray-ops";

import { food101topK } from "./utils";

const loadImage = window.loadImage;
const { TextArea } = Input;

const mapProb = prob => {
  if (prob * 100 < 2) {
    return "2%";
  } else {
    return prob * 100 + "%";
  }
};

class App extends Component {
  constructor() {
    super();
    let hasWebgl = false;
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    // Report the result.
    if (gl && gl instanceof WebGLRenderingContext) {
      hasWebgl = true;
    } else {
      hasWebgl = false;
    }

    this.state = {
      urlInput: "",
      model: null,
      modelLoaded: false,
      modelLoading: false,
      modelRunning: false,
      imageLoadingError: false,
      loadingPercent: 0,
      classifyPercent: 0,
      topK: null,
      hasWebgl,
      textForJudge: "",
      url: "https://i.loli.net/2019/06/09/5cfc75b68f7a687369.png"
    };
  }

  columns = [
    {
      title: "Prediction",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "probability",
      dataIndex: "probability",
      key: "probability",
      render: (text, _, index) => {
        text = (text * 100).toFixed(5);
        return index === 0 ? (
          <div style={{ color: "red", fontWeight: "bold" }}>{text}%</div>
        ) : (
          <div>{text}%</div>
        );
      }
    }
  ];

  judgeColumns = [
    {
      title: "pos",
      dataIndex: "pos",
      key: "pos",
      render: (text, record, index) => {
        text = (text * 100).toFixed(5);
        console.log(record);
        const { pos, neg, neutral } = record;
        return pos > neg && pos > neutral ? (
          <div style={{ color: "red", fontWeight: "bold" }}>{text}%</div>
        ) : (
          <div>{text}%</div>
        );
      }
    },
    {
      title: "neg",
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
  loadModel = () => {
    const model = new window.KerasJS.Model({
      filepaths: {
        model: "model.json",
        weights: "model4b.10-0.68_weights.buf",
        metadata: "model4b.10-0.68_metadata.json"
      },
      gpu: this.state.hasWebgl,
      layerCallPauses: true
    });

    let interval = setInterval(() => {
      const percent = model.getLoadingProgress();
      this.setState({
        loadingPercent: percent
      });
    }, 100);

    const waitTillReady = model.ready();

    waitTillReady
      .then(() => {
        clearInterval(interval);
        this.setState({
          loadingPercent: 100,
          modelLoading: false,
          modelLoaded: true
        });

        setTimeout(() => this.loadImageToCanvas(this.state.url), 100);
      })
      .catch(err => {
        clearInterval(interval);
      });

    this.setState({
      modelLoading: true,
      model
    });
  };

  /**
   * @description
   *
   * @param {text}
   */
  loadTextToJudge = text => {
    console.log(text);

    let proxyUrl = "https://cors-anywhere.herokuapp.com/",
      targetUrl = "http://text-processing.com/api/sentiment/";

    axios
      .post(
        proxyUrl + targetUrl,
        qs.stringify({
          text: text,
          language: "english"
        })
      )
      .then(response => {
        console.log(response.data);
        this.setState({
          sentimentData: response.data
        });
        console.log(this.state.sentimentData);
      })
      .catch(error => {
        console.log(error);
      });
  };

  loadImageToCanvas = url => {
    if (!url) {
      return;
    }

    this.setState({
      imageLoadingError: false,
      imageLoading: true,
      loadingPercent: 0,
      classifyPercent: 0,
      topK: null
    });

    loadImage(
      url,
      img => {
        if (img.type === "error") {
          this.setState({
            imageLoadingError: true,
            imageLoading: false,
            modelRunning: false,
            url: null
          });
        } else {
          const ctx = document.getElementById("input-canvas").getContext("2d");
          ctx.drawImage(img, 0, 0);
          this.setState({
            imageLoadingError: false,
            imageLoading: false,
            modelRunning: true
          });
          setTimeout(() => {
            this.runModel();
          }, 1000);
        }
      },
      {
        maxWidth: 299,
        maxHeight: 299,
        cover: true,
        crop: true,
        canvas: true,
        crossOrigin: "Anonymous"
      }
    );
  };

  runModel = () => {
    const ctx = document.getElementById("input-canvas").getContext("2d");
    const imageData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );

    const { data, width, height } = imageData;
    let dataTensor = ndarray(new Float32Array(data), [width, height, 4]);
    let dataProcessedTensor = ndarray(new Float32Array(width * height * 3), [
      width,
      height,
      3
    ]);
    ops.divseq(dataTensor, 255);
    ops.subseq(dataTensor, 0.5);
    ops.mulseq(dataTensor, 2);
    ops.assign(
      dataProcessedTensor.pick(null, null, 0),
      dataTensor.pick(null, null, 0)
    );
    ops.assign(
      dataProcessedTensor.pick(null, null, 1),
      dataTensor.pick(null, null, 1)
    );
    ops.assign(
      dataProcessedTensor.pick(null, null, 2),
      dataTensor.pick(null, null, 2)
    );

    const inputData = { input_1: dataProcessedTensor.data };
    const predPromise = this.state.model.predict(inputData);

    const totalLayers = Object.keys(this.state.model.modelDAG).length;
    let interval = setInterval(() => {
      const completedLayers = this.state.model.layersWithResults.length;
      this.setState({
        classifyPercent: ((completedLayers / totalLayers) * 100).toFixed(2)
      });
    }, 50);

    predPromise.then(outputData => {
      clearInterval(interval);
      const preds = outputData["dense_1"];
      const topK = food101topK(preds);
      this.setState({
        topK,
        modelRunning: false
      });
    });
  };

  render() {
    const {
      loadingPercent,
      modelLoaded,
      modelLoading,
      modelRunning,
      imageLoading,
      imageLoadingError,
      classifyPercent,
      topK
    } = this.state;
    return (
      <div className="App">
        <Row type="flex" align="start" justify="start">
          <Col span={21} push={3}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h1 className="header">Qathena Visual Recommendation Demo</h1>
              <p className="intro">
                Imitating the format of social networking posts, input a picture
                and a paragraph of text, and analyze the content through machine
                learning technology.
              </p>
            </div>
          </Col>
          <Col span={3} pull={21}>
            <img
              className="qathena-logo"
              src="https://i.loli.net/2019/06/11/5cff2120d0b1230348.jpeg"
            />
          </Col>
        </Row>
        <Divider className="divider" />
        <Row type="flex" align="start" justify="start" className="row-body">
          <Col span={13}>
            <div className="init">
              <Alert
                style={{
                  margin: "0 0 3rem 1.5rem",
                  textAlign: "left",
                  width: "50%"
                }}
                message="Demo1: Food Image Recognition by Deep Learning"
              />
              {!modelLoaded && !modelLoading ? (
                <div>
                  <Tooltip
                    placement="right"
                    title="The model may be fairly large, so keep that in
                    mind if progress seems stuck while loading model (model size ~85 Mb)."
                  >
                    <Button type="secondary" onClick={this.loadModel}>
                      Click to Load Model
                    </Button>
                  </Tooltip>
                </div>
              ) : null}
              {!modelLoaded && modelLoading ? (
                <p className="loading">
                  Loading Model...
                  <br />
                  <Progress
                    className="progress-loading"
                    percent={+loadingPercent}
                  />
                  <p style={{ marginTop: "5px" }}>
                    It may take about 10mins to load, please be patient.
                  </p>
                </p>
              ) : (
                ""
              )}
              {modelLoaded && imageLoading ? (
                <p className="loading">Image Loading...</p>
              ) : (
                ""
              )}
              {modelLoaded && imageLoadingError ? (
                <p className="error">
                  Error Loading Image. Please Try Different Url.
                </p>
              ) : (
                ""
              )}
              {modelLoaded && modelRunning ? (
                <p className="loading">
                  Classifying...
                  <br />
                  <Progress
                    className="progress-loading"
                    percent={+classifyPercent}
                  />
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="interactive">
              {modelLoaded && !modelRunning && !imageLoading ? (
                <Input.Search
                  className="input-url"
                  placeholder="Please enter a new food image url to classify"
                  enterButton="click to classify"
                  onSearch={value => this.loadImageToCanvas(value)}
                />
              ) : (
                ""
              )}
              <div className="content">
                <canvas id="input-canvas" width="299" height="299" />
                {topK ? (
                  <Table
                    rowKey={record => record.name}
                    dataSource={topK}
                    columns={this.columns}
                    pagination={false}
                    bordered
                  />
                ) : null}
              </div>
            </div>
          </Col>
          <Col span={1}>
            <Divider type="vertical" className="divider-vertical" />
          </Col>
          <Col span={10} style={{ padding: "0 50px" }}>
            <Alert
              style={{ margin: "0 0 2rem 0", textAlign: "left", width: "70%" }}
              message="Demo2: Descriptive text sentiment analysis"
            />
            <p
              style={{
                textAlign: "left",
                marginBottom: "2rem",
                width: "90%"
              }}
            >
              Note: According to the emotions contained in the text, we analyze
              the evaluation of the dishes when the guests eat that.
            </p>
            <TextArea
              style={{ width: "100%" }}
              placeholder="Please enter a description for the food image (e.g, Wow! the sushi looks delicious!) "
              autosize={{ minRows: 3, maxRows: 6 }}
              onChange={e => this.setState({ textForJudge: e.target.value })}
            />

            <Button
              type="secondary"
              style={{ width: "100%", marginTop: "20px" }}
              onClick={() => this.loadTextToJudge(this.state.textForJudge)}
            >
              Click to Judge
            </Button>
            {this.state.sentimentData ? (
              <div>
                <Table
                  style={{ marginTop: 20 }}
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
                  <div style={{ margin: "0 20px 0 0" }}>
                    The result is {this.state.sentimentData.label}
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
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
