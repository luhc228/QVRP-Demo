import * as React from "react";
import "../../utils/text.css";

export default class Intro extends React.Component {
  render() {
    return (
      <div style={{ padding: 24, background: "#fff", textAlign: "center" }}>
        <p className="title">1. Project Description</p>
        <p className="text">
          Food images are uploaded daily into social medial sites such as
          Instagram and Pinterest. Most of these images are vaguely tags by the
          uploader. The program will download images for popular influencers and
          analyze the image using visual recognition to detect if it is a
          burger, noodles or pasta dish. With the caption that is tagged with
          the image, using Natural Language Processing help better classify the
          image and extract additional sentiments.
        </p>
        <br />
        <p className="subtitle">1.1 Problem Statement</p>
        <p className="text">
          By downloading all the top 10000 influencer images from Instagram,
          using both visual recognition and NLP to better classify the food dish
          and sentiment around it. Using this database, uploading any random
          image with a caption to get baseline accuracy of the program. Next
          steps is to apply any Visual/NLP algorithm to enhance accuracy of the
          program.
        </p>
        <p style={{ textAlign: "center" }}>
          <img
            style={{ width: "55%" }}
            src="https://i.loli.net/2019/06/13/5d021db6b282d73951.png"
          />
        </p>
        <br />
        <p className="subtitle">1.2 Project Tasks</p>
        <p className="text">
          According our requiremnets, we have several parts (small tasks) of
          this whole big project:
        </p>
        <p className="text">
          &nbsp; * Data Collector (Spider)
          <br /> &nbsp; * Food Classification (CV)
          <br />
          &nbsp; * Text Sentiment Analysis (NLP)
          <br />
          &nbsp; * New Trainning Algorithms
        </p>
        <p className="text">
          We use data collector to collect raw data from social medias. Use food
          classification and text sentiment analysis to help us clean data, and
          train a better machine learning model using new algorithms and better
          designs.
        </p>
        <br />
        <p className="title">2. Project Dataset</p>
        <p className="subtitle">2.1 Data from Instagram</p>
        <p className="text">
          <p style={{ textAlign: "center" }}>
            <img
              style={{ width: "60%" }}
              src="https://i.loli.net/2019/06/13/5d020d0a5383d93882.png"
            />
          </p>
          For the posts in the social medias like Instagram, we have two kinds
          of data, food image and food comments. There is a correspondence
          between food pictures and food reviews. Something like picture above.
          In the dirty data from Instagram, we can get both images and comments.
          So we may have a data structure like:
        </p>
        <p className="code-block">Data = (Images ... , Comment ...)</p>

        <p className="text">
          But this is the ideal situation. Posts posted by users on social media
          are often not all photos of food, so we still need to clean the data
          in the next step to get a better result.
        </p>
        <br />
        <p className="subtitle">2.2 Computer Vision Data</p>
        <p className="text">
          Our data comes from Instagram, which has an API for data getting, but
          if we need to get specific tag like 'food', there may be many types of
          food, we cannot control this (screen out specific foods). As for deep
          learning classification tasks, we need specific food tags. So I used a
          specific food classification dataset for initial model training. The
          initial dataset is 'food-101' which means there are 101 kinds of food
          in this dataset, and the last model can recognize over 100 kinds of
          food. Full food list can be found here:
          <p style={{ textAlign: "center" }}>
            <br />
            <img
              src="https://i.loli.net/2019/06/13/5d02120f846ef38166.png"
              style={{ width: "70%" }}
            />
          </p>
        </p>
        <p className="text">
          With these initial data, we can train a basic deep learning model and
          use it for our data washing in the next step (as be a very important
          part of the whole system).
        </p>
        <br />
        <p className="subtitle">2.3 Text Sentiment Analysis Data</p>
        <p className="text">
          For text sentiment analysis task, we used a very simple model:
          <a ref="https://scikit-learn.org/stable/modules/generated/sklearn.svm.LinearSVC.html">
            {" "}
            LinearSVC
          </a>
          , which comes from the sklearn. Our text data comnes from{" "}
          <a ref="http://epinions.com/?sb=1"> epinions.com</a>. Text sentiment
          results can be divided into three parts (with different emotions):
        </p>
        <p className="text">
          &nbsp; * Pos (Positive)
          <br /> &nbsp; * Neg (Negative)
          <br />
          &nbsp; * Nor (Normal)
        </p>
        <p className="text">
          After trainning this model, we can classify our food comments into
          those three parts, and tag those pictures with those three kinds of
          tag.
        </p>
        <p className="text">
          The model is based on <strong>LinearSVC</strong> classifier and is
          able to distinguish between positive and negative sentences with best
          <strong> CV score = 0.801013024602</strong>. If a food comment is Pos,
          then we think the food quality is good, delicious, the same as Neg and
          Nor.
        </p>
        <br />
        <p className="title">3. Food Recognition Algorithms</p>
        <p className="text">
          For trainning the food-101 model, we have done some basic experiments,
          and read some related papers, here are the references and documents.
        </p>
        <p className="subtitle">3.1 Reference</p>
        <p className="text">
          <a href="https://www.vision.ee.ethz.ch/datasets_extra/food-101/static/bossard_eccv14_food-101.pdf">
            * Food-101 – Mining Discriminative Components with Random Forests.
          </a>
          <br />
          <a href="https://ieeexplore.ieee.org/abstract/document/7460262">
            * Performance evaluation of hybrid CNN for SIPPER plankton image.
            calssification
          </a>
          <a ref="https://arxiv.org/pdf/1612.06543.pdf">
            * Wide-Slice Residual Networks for Food Recognition.
          </a>
          <br />
          <a ref="https://www.gputechconf.co.kr/assets/files/presentations/2-1650-1710_DL_Contest_%EC%A7%80%EC%A0%95%EC%A3%BC%EC%A0%9C_%EB%8C%80%EC%83%81.pdf">
            * NVIDIA DEEP LEARNING CONTEST 2016.
          </a>
          <br />
          <a ref="http://dl.acm.org/citation.cfm?id=2986042">
            * Food Image Recognition Using Very Deep Convolutional Networks.
          </a>
        </p>
        <br />
        <p className="subtitle">3.2 Food Image Dataset</p>
        <p className="text">
          According to dataset:
          <a href="https://www.vision.ee.ethz.ch/datasets_extra/food-101">
            {" "}
            Food-101 Dataset.
          </a>
        </p>
        <br />
        <p style={{ textAlign: "center" }}>
          <img
            src="https://i.loli.net/2019/06/13/5d0219847ed6c19511.png"
            style={{ width: "80%" }}
          />
        </p>
        <p className="text">
          There are 101 different classes of food, with 1000 labeled images per
          class available for supervised training.
        </p>
        <br />
        <p className="subtitle">3.3 Test and Trainning</p>
        <p className="text">
          We will be retraining a Google InceptionV3 model, pretrained on
          ImageNet. The neural network architecture is:
        </p>
        <p style={{ textAlign: "center" }}>
          <img
            src="https://i.loli.net/2019/06/13/5d024a54d8e2f90521.png"
            style={{ width: "80%" }}
          />
        </p>
        <p className="text">
          I used two GXT 1080Ti(s) to train this model, and each epoch of training
          time takes about 20 minutes.
        </p>
        <br />
        <p className="subtitle">3.4 Results</p>
        <p className="text">
          After fine-tuning a pre-trained Google
          <a ref="https://keras.io/applications/#inceptionv3"> InceptionV3 </a>
          model, I was able to achieve about <strong>82.03%</strong> Top-1
          Accuracy on the test set using a single crop per item. Using 10 crops
          per example and taking the most frequent predicted classes, I was able
          to achieve
          <strong> 86.97% </strong>Top-1 Accuracy and <strong>97.42%</strong>{" "}
          Top-5 Accuracy.
        </p>
        <p className="text">
          Others have been able to achieve more accurate results:
        </p>
        <p className="text">
          &nbsp; <strong>* InceptionV3: 88.28%</strong> Top-1 Accuracy with
          unknown-crops.
          <a ref="http://dl.acm.org/citation.cfm?id=2986042">
            {" "}
            Hassannejad, Hamid, et al. "Food Image Recognition Using Very Deep
            Convolutional Networks." Proceedings of the 2nd International
            Workshop on Multimedia Assisted Dietary Management. ACM, 2016.
          </a>
          <br /> &nbsp; <strong>* ResNet200: 90.14% </strong> Top-1 Accuracy on
          the Food-101 dataset augmented with 19 Korean dishes.
          <a ref="https://www.gputechconf.co.kr/assets/files/presentations/2-1650-1710_DL_Contest_%EC%A7%80%EC%A0%95%EC%A3%BC%EC%A0%9C_%EB%8C%80%EC%83%81.pdf">
            {" "}
            NVIDIA DEEP LEARNING CONTEST 2016, Keun-dong Lee, DaUn Jeong,
            Seungjae Lee, Hyung Kwan Son (ETRI VisualBrowsing Team), Oct.7,
            2016.
          </a>
          <br />
          &nbsp; <strong>* WISeR: 90.27% </strong> Top-1 Accuracy with 10-crops
          <a ref="https://arxiv.org/pdf/1612.06543.pdf">
            {" "}
            Martinel, Niki, Gian Luca Foresti, and Christian Micheloni.
            "Wide-Slice Residual Networks for Food Recognition." arXiv preprint
            arXiv:1612.06543 (2016).
          </a>
        </p>
      </div>
    );
  }
}
