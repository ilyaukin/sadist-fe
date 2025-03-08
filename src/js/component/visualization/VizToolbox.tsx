import React, { Dispatch, useEffect, useRef, useState } from 'react';
import Dialog, { DialogButton } from '../common/Dialog';
import ObjectEditor, { ObjectEditorRef } from '../common/ObjectEditor';
import Block from '../common/Block';
import Toolbox from '../common/Toolbox';
import Icon from '../../icon/Icon';
import { DsInfo } from '../../model/ds';
import { DsInfoAction, DsInfoActionType } from '../../reducer/dsInfo-reducer';

interface VizToolboxProps {
  dsInfo: DsInfo;
  dispatchDsInfo: Dispatch<DsInfoAction>;
}

/**
 * Toolbox to manage visualization
 * @param props
 * @constructor
 */
const VizToolbox = (props: VizToolboxProps) => {
  const { dsInfo, dispatchDsInfo } = props;

  // Dialog to edit visualisation as JSON
  const [vizEditor, setVizEditor] = useState(false);
  const vizEditorRef = useRef<ObjectEditorRef | null>(null);
  useEffect(() => {
    setTimeout(() => {
      const editor = vizEditorRef.current?.underlying;
      if (editor) {
        editor.focus();
      }
    }, 100);
  });
  const vizSchema = require('/json_schema/viz.json');

  return <>
    <Dialog
        className="json-editor-dialog"
        onClose={() => setVizEditor(false)}
        open={vizEditor}
        buttons={[DialogButton.FULL]}
    >
      <ObjectEditor
          id="viz-editor"
          className="json-editor-block"
          obj={dsInfo.vizMeta}
          schema={vizSchema}
          setRef={(ref) => {
            vizEditorRef.current = ref;
          }}
          onChanged={(vizMeta) => {
            dispatchDsInfo({
              type: DsInfoActionType.SET_VIZ,
              vizMeta,
            });
            setVizEditor(false);
          }}
          onUnchanged={() => {
            setVizEditor(false);
          }}
      />
      <Block size="content">
        {/*margin-left, margin-right to make it wider.*/}
        <wired-button key="ok" onClick={() => {
          vizEditorRef.current?.save();
        }}><strong style={{ marginLeft: '20px', marginRight: '20px' }}>OK</strong>
        </wired-button>
        <wired-button key="cancel" onClick={() => {
          setVizEditor(false);
        }}>Cancel
        </wired-button>
      </Block>
    </Dialog>
    <Toolbox>
      <Toolbox.Button
          src={Icon.fileJson}
          alt="Edit vizualisation"
          onClick={() => setVizEditor(true)}
      />
    </Toolbox>
  </>;
}

export default VizToolbox;
