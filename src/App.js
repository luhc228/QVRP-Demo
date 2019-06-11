import React, { Component } from "react";
import Button from "antd/lib/button";
import { Progress, Divider, Input, Table } from "antd";
import "./App.css";

import ndarray from "ndarray";
import ops from "ndarray-ops";

import { food101topK } from "./utils";

const loadImage = window.loadImage;

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
    console.log("WebGL enabled:", hasWebgl);

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
    console.log("Loading Model");
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
      console.log("Progress", percent, model.xhrProgress);
      this.setState({
        loadingPercent: percent
      });
    }, 100);

    const waitTillReady = model.ready();

    waitTillReady
      .then(() => {
        clearInterval(interval);
        console.log("Model ready");
        this.setState({
          loadingPercent: 100,
          modelLoading: false,
          modelLoaded: true
        });

        setTimeout(() => this.loadImageToCanvas(this.state.url), 100);
      })
      .catch(err => {
        clearInterval(interval);
        console.log("err", err);
      });

    this.setState({
      modelLoading: true,
      model
    });
  };

  loadImageToCanvas = url => {
    console.log("Loading Image");
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
          console.log("Error loading image");
          this.setState({
            imageLoadingError: true,
            imageLoading: false,
            modelRunning: false,
            url: null
          });
        } else {
          console.log("Image Loaded");
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
    console.log("Running Model");

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
      console.log(outputData);
      clearInterval(interval);
      const preds = outputData["dense_1"];
      const topK = food101topK(preds);
      console.log(topK);
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
        <img
          className="qathena-logo"
          src="https://i.loli.net/2019/06/11/5cff2120d0b1230348.jpeg"
        />
        <h1 className="header">Qathena Visual Recommendation Demo</h1>
        <p className="intro">
          Note: The file may be fairly large for some (85 MB), so keep that in
          mind if progress seems stuck while loading model.
        </p>
        <Divider />
        <div className="init">
          {!modelLoaded && !modelLoading ? (
            <Button type="secondary" onClick={this.loadModel}>
              Click to Load Model (85 MB)
            </Button>
          ) : null}
          {!modelLoaded && modelLoading ? (
            <p className="loading">
              Loading Model...
              <br />
              <Progress className="progress-loading" percent={+loadingPercent} />
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
              Error Loading Image.
              <br />
              Try Different Url
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
              className="input"
              placeholder="please enter a food image url"
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
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
