import React from "react";
import PropType from "prop-types";
import 'wired-radio-group';
import 'wired-radio';
import 'wired-button';
import 'wired-checkbox';
import './index.css';
import './labelling.css';
import { renderPage } from "../helper/react-helper";
import LabellingInterface from "./labelling/LabellingInterface";
import ClassLabellingInterface from "./labelling/ClassLabellingInterface";
import GeoLabellingInterface from "./labelling/GeoLabellingInterface";

const LabellingPage = (props) => {
  switch (props.type) {
    case 'class':
      return <ClassLabellingInterface {...props}/>

    case 'geo':
      return <GeoLabellingInterface {...props}/>

    default:
      return <span>Labelling interface type is not defined.</span>;
  }
}

LabellingPage.propTypes = LabellingInterface.propTypes;

LabellingPage.defaultProps = LabellingInterface.defaultProps;

renderPage(<LabellingPage/>);

export default LabellingPage;
