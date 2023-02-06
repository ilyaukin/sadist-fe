import React from "react";
import '/packages/wired-radio-group';
import '/packages/wired-radio';
import '/packages/wired-button';
import '/packages/wired-checkbox';
import '../../css/index.scss';
import '../../css/labelling.css';
import { renderPage } from "../helper/react-helper";
import { defaultLabellingInterfaceProps, LabellingInterfaceProps } from "./labelling/LabellingInterface";
import ClassLabellingInterface from "./labelling/ClassLabellingInterface";
import GeoLabellingInterface from "./labelling/GeoLabellingInterface";

const LabellingPage = (props: LabellingInterfaceProps) => {
  switch (props.type) {
    case 'class':
      return <ClassLabellingInterface {...props}/>

    case 'geo':
      return <GeoLabellingInterface {...props}/>

    default:
      return <span>Labelling interface type is not defined.</span>;
  }
}

LabellingPage.defaultProps = defaultLabellingInterfaceProps;

renderPage(<LabellingPage/>);

export default LabellingPage;