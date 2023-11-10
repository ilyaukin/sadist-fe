import React, { useContext, useEffect, useRef, useState } from 'react';
import { WiredCombo } from '/wired-elements/lib/wired-combo';
import ErrorDialog from "../common/ErrorDialog";
import Icon from "../../icon/Icon";
import DsNew from "./DsNew";
import Dialog, { DialogButton } from "../common/Dialog";
import { isVal } from "../../helper/wired-helper";
import { DsMeta } from '../../model/ds';
import UserContext from '../../context/UserContext';

interface DsListProps {
  dsId?: string;
  onLoadList: (dsList: DsMeta[]) => any;
  onDsSelected: (dsMeta: DsMeta) => any;
}

interface DsListState {
  list: DsMeta[];
  loading: boolean;
  creatingNew?: boolean;
  index: { [dsId: string]: DsMeta };
  newItem?: DsMeta;
}

const DsList = (props: DsListProps) => {
  const [state, setState] = useState<DsListState>({
    list: [],
    loading: true,
    index: {},
  });

  const { dsId, onLoadList, onDsSelected } = props;

  const comboRef = useRef<WiredCombo | null>(null);

  const userContextValue = useContext(UserContext);

  useEffect(() => {
    if (userContextValue.loaded) {
      fetch('/ls')
          .then((response) => response.json())
          .then((data) => {
            if (data.success && data.list) {
              let index: { [dsId: string]: DsMeta } = {}
              data.list.forEach((v: DsMeta) => {
                index[v.id!] = v;
              });

              setState({
                ...state,
                list: data.list,
                loading: false,
                index
              });
              onLoadList(data.list);
            } else {
              ErrorDialog.raise('Error: ' + ( data.error || 'Unknown error' ))
            }
          }).catch((err) => {
        ErrorDialog.raise('Error fetching data: ' + err.toString())
      })
    }
  }, [userContextValue.user, userContextValue.loaded]);

  useEffect(() => {
    if (state.newItem) {
      onDsSelected(state.newItem);
    }
  }, [state.newItem]);

  function onComboValueSelected(value: string, _event: CustomEvent) {
    // special handling for creating new ds
    if (value === 'new') {
      setState({ ...state, creatingNew: true });
      return;
    }

    // pass DS list record (meta information about DS)
    const meta = state.index[value] || { id: value };
    onDsSelected(meta);
  }

  const onDsCreated = (item: DsMeta) => {
    let newState: DsListState = { ...state, creatingNew: undefined };

    // add {id, name} to the list (or request the list
    // from the server again - dunno what's better).
    const { id, name } = item;

    if (!id || !name) {
      ErrorDialog.raise('Got invalid item from server: ' + JSON.stringify(item));
    } else {
      let list = state.list;
      // remove item with the same name, if any, (if we already uploaded
      // this data source, probably should ask to override/rename)
      list = list.filter(item => item.name !== name);
      // add new item
      list = [...list, item];
      newState = {
        ...newState,
        list,
        index: { ...state.index, [id]: item }, /*to simulate callback*/
        newItem: item,
      };
    }

    setState(newState);
  }

  const onCancelDsCreate = () => {
    setState({ ...state, creatingNew: undefined });
  }

  function renderItem(item: DsMeta) {
    let pic;
    switch (item.type) {
      case 'GoogleSheet':
        pic = Icon.google;
        break;
      case 'New':
        pic = Icon.plus;
        break;
      default:
        pic = Icon.question;
    }
    return <wired-item
        key={item.id}
        value={item.id}>
      <img className="item" src={pic} alt={item.type || '?'}/>
      {item.name}
    </wired-item>;
  }

  const { loading, list, creatingNew } = state;

  return <div style={{ margin: '10px' }}>
    <Dialog className="new-dialog"
            open={creatingNew} buttons={[DialogButton.FULL, DialogButton.CLOSE]}
            onClose={onCancelDsCreate}>
      <DsNew onDsCreated={onDsCreated}/>
    </Dialog>
    <wired-combo
        ref={comboRef}
        disabled={isVal(loading)}
        selected={dsId}
        onselected={(e: CustomEvent) => onComboValueSelected(e.detail?.selected, e)}
    >
      {renderItem({ id: 'new', 'name': 'New', type: 'New' })}
      {list.map(renderItem)}
    </wired-combo>
  </div>
}

export default DsList;
