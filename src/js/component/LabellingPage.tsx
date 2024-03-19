import React from "react";
import '../../css/index.scss';
import '../../css/labelling.css';
import { renderPage } from "../helper/react-helper";
import './common/CustomElement';
import { defaultLabellingInterfaceProps, LabellingInterfaceProps } from "./labelling/LabellingInterface";
import ClassLabellingInterface from "./labelling/ClassLabellingInterface";
import GeoLabellingInterface from "./labelling/GeoLabellingInterface";
import SequenceLabellingInterface from './labelling/SequenceLabellingInterface';

const LabellingPage = (props: LabellingInterfaceProps) => {
  switch (props.type) {
    case 'class':
      return <ClassLabellingInterface {...props}/>

    case 'geo':
      return <GeoLabellingInterface {...props}/>

    case 'seq':
      return <SequenceLabellingInterface {...props}/>

    default:
      return <span>Labelling interface type is not defined.</span>;
  }
}

LabellingPage.defaultProps = defaultLabellingInterfaceProps;

renderPage(<LabellingPage/>);

export default LabellingPage;
