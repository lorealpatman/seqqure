import React, { Component } from "react";
// import * as ajaxcalls from "../services/imageUpload.service";
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper"; // npm install react-cropper.js
import axios from "axios";
import rand from "random-key";
import * as peopleService from "../services/people.service";
import Notifier from "../helpers/notifier";

/* global FileReader */
const data_uri = "";

let baseUrl = process.env.REACT_APP_WEB_API_DOMAIN || "";
baseUrl += "/api";

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: {},
      data_uri,
      cropResult: null,
      filesize: ""
    };
    this.cropImage = this.cropImage.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.handleFile = this.handleFile.bind(this);
  }

  handleFile(e) {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = upload => {
        this.setState({
          data_uri: reader.result,
          filename: file.name,
          filetype: file.type,
          filesize: file.size
        });
        // if (file.size > 100000) {
        //   Notifier.error("File size Greater then 100KB!");
        //   // reader.abort();
        // } else {

        // }
      };
      reader.readAsDataURL(file);
    } else {
      Notifier.error("Failed to load file");
    }
  }

  cropImage(e) {
    e.preventDefault();
    if (typeof this.cropper.getCroppedCanvas() === "undefined") {
      return;
    }
    this.setState({
      cropResult: this.cropper
        .getCroppedCanvas({
          width: 256,
          height: 256
        })
        .toDataURL()
    });
  }

  async uploadImage(event) {
    event.preventDefault();

    // file: this.state.cropResult,
    const image = {
      filename: rand.generate() + "-" + this.state.filename,
      filetype: this.state.filetype
    };
    peopleService.putFileKey(this.props.personId, image.filename).then();

    //get the signed url
    let signedUrlResponse = await axios.post(
      baseUrl + "/signedUrl",
      { filename: image.filename, filetype: image.filetype },
      { withCredentials: true }
    );
    //convert the cropped canvas to a blob
    this.cropper
      .getCroppedCanvas({
        width: 256,
        height: 256
      })
      .toBlob(blob => {
        var croppedFile = new File([blob], image.filename, {
          type: this.state.filetype
        }); //the blob file
        console.log(signedUrlResponse, croppedFile);
        var options = {
          headers: {
            "Content-Type": image.filetype,
            withCredentials: true
          }
        };
        //send the file: it requires the signed url, blob file, optioins (see the var)
        axios.put(signedUrlResponse.data.item, croppedFile, options);
      });
    Notifier.success("Image Uploaded");
  }

  render() {
    console.log(this.state);
    return (
      <React.Fragment>
        <div className="uploaderContainer" style={{ padding: 15 }}>
          <div className="row">
            <input
              type="file"
              onChange={this.handleFile}
              accept={[".png", ".jpg", ".jpeg"]}
              size={100000}
            />
            {/* <input
                // disabled={this.state.processing}
                className="btn btn-primary"
                type="submit"
                value="Upload"
              />
              {processing} */}

            <br />
            <div className="row">
              <div className="col-md-5">
                <Cropper
                  style={{ height: 250 }}
                  aspectRatio={1 / 1}
                  preview=".img-preview"
                  guides={true}
                  src={this.state.data_uri}
                  ref={cropper => {
                    this.cropper = cropper;
                  }}
                />
              </div>
              <div className="col-md-5">
                <img
                  className="img-responsive"
                  style={{ height: 250 }}
                  src={this.state.cropResult}
                  alt=""
                />
              </div>
            </div>
          </div>
          <br style={{ clear: "both" }} />
        </div>
        <br />
        <div>
          <button
            type="button"
            className="btn btn-success"
            onClick={this.cropImage}
            style={{ float: "left", padding: 5 }}
          >
            Crop Image
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.uploadImage}
            style={{ float: "left", padding: 5 }}
          >
            Upload Image
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default ImageUpload;
