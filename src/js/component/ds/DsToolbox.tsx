import React, { useEffect, useRef, useState } from 'react';
import Toolbox from '../common/Toolbox';
import { DsInfo } from '../../model/ds';
import Icon from '../../icon/Icon';
import { DsInfoAction, DsInfoActionType } from '../../reducer/dsInfo-reducer';
import Dialog, { DialogButton } from '../common/Dialog';
import ObjectEditor, { ObjectEditorRef } from '../common/ObjectEditor';
import Block from '../common/Block';

interface DsToolboxProps {
  dsInfo: DsInfo;
  dispatchDsInfo: React.Dispatch<DsInfoAction>;
}

/**
 * A toolbox to manage DS
 *
 * @param props
 * @constructor
 */
const DsToolbox = (props: DsToolboxProps) => {
  // All dialogs to manage DS will be rendered here.
  // They'll be shown/not shown, depending on if a user clicks
  // toolbox menu.

  // There can be multiple dialogs or a single dialog with tabs.
  // There can be also a switch between form-based and JSON-based
  // editor for each dialog or tab.
  // To be extent while implementing...

  // Edit filters as JSON.
  const [filtersEditor, setFiltersEditor] = useState(false);
  const filtersEditorRef = useRef<ObjectEditorRef>();
  useEffect(() => {
    if (filtersEditor) {
      setTimeout(() => {
        // Have to have focus after timeout, because
        // otherwise it doesn't work
        let editor = filtersEditorRef.current!.underlying;
        if (editor) {
          editor.focus();
          // Fold "values" cos they are huge blocks...
          const lines = editor.findAll('"values":').map(pos => pos[0]);
          editor.fold(lines);
        }
      }, 100);
    }
  });
  const filtersSchema = require('/json_schema/filters.json');

  const { dsInfo, dispatchDsInfo } = props;

  return <>
    <Dialog
        className="json-editor-dialog"
        onClose={() => setFiltersEditor(false)}
        open={filtersEditor}
        buttons={[DialogButton.FULL]}
    >
      <ObjectEditor
          id="filters-editor"
          className="json-editor-block"
          obj={dsInfo.filters}
          schema={filtersSchema}
          setRef={(ref) => {
            filtersEditorRef.current = ref;
          }}
          onChanged={(filters) => {
            dispatchDsInfo({
              type: DsInfoActionType.SET_FILTERS,
              filters,
            });
            setFiltersEditor(false);
          }}
          onUnchanged={() => {
            setFiltersEditor(false);
          }}
      />
      <Block size="content">
        {/*margin-left, margin-right to make it wider.*/}
        <wired-button key="ok" onClick={() => {
          filtersEditorRef.current?.save();
        }}><strong style={{ marginLeft: '20px', marginRight: '20px' }}>OK</strong>
        </wired-button>
        <wired-button key="cancel" onClick={() => {
          setFiltersEditor(false);
        }}>Cancel
        </wired-button>
      </Block>
    </Dialog>
    <Toolbox>
      <Toolbox.Button
          src={Icon.fileJson}
          alt="Edit filters"
          onClick={() => setFiltersEditor(true)}
      />
    </Toolbox>
  </>;
}

export default DsToolbox;
