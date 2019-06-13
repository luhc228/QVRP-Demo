import React, { Component } from "react";
import Button from "antd/lib/button";
import { Progress, Alert, Input, Table, Tooltip, Divider } from "antd";
import "./index.css";
import "../../utils/text.css";

import ndarray from "ndarray";
import ops from "ndarray-ops";

import { food101topK } from "../../utils/utils";

const loadImage = window.loadImage;

const mapProb = prob => {
  if (prob * 100 < 2) {
    return "2%";
  } else {
    return prob * 100 + "%";
  }
};

class Demo1 extends Component {
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
      <div
        style={{
          padding: 24,
          background: "#fff",
          textAlign: "center"
        }}
      >
        <div className="init">
          <Alert
            style={{ margin: "0 0 2rem 0", textAlign: "left", width: "100%" }}
            message="Demo1: Food Image Recognition by Deep Learning"
          />
          <Divider orientation="left">Control Panel</Divider>
          <p className="text-small">
            Please click <strong>Click to Load Model</strong> button to load the
            food-101 model first for the next operations. We have a default
            image for testing once your model loaded, it's a sushi, after this,
            put a random image url for fun!
          </p>
          {!modelLoaded && !modelLoading ? (
            <div>
              <Tooltip
                placement="right"
                title="The model may be fairly large, so keep that in
                    mind if progress seems stuck while loading model (model size ~85 Mb)."
              >
                <Button
                  type="secondary"
                  style={{ width: "299px" }}
                  onClick={this.loadModel}
                >
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
              <p style={{ marginTop: "5px" }}>
                If the progress bar is stuck, the model is not loaded
                successfully. Please refresh the page and reload.
              </p>
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
          <Divider orientation="left">Loaded Image</Divider>
          <p className="text-small">The loaded image will be displaied here:</p>
          <div className="content">
            <canvas id="input-canvas" width="299" height="299" />
          </div>
          <Divider orientation="left">Tested Results</Divider>
          <p className="text-small">
            Will display top five results with highest probability, total result
            accuracy of this model (5 results) is <strong>97.42%</strong>. Here
            is the results:
          </p>
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
    );
  }
}

export default Demo1;
