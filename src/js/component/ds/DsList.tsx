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

  const combo = useRef<WiredCombo | null>(null);

  const dsValue = useRef<any | undefined>();

  const userContextValue = useContext(UserContext);

  useEffect(() => {
    fetch('/ls').then((response) => {
      response.json().then((data) => {
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
        } else {
          ErrorDialog.raise('Error: ' + ( data.error || 'Unknown error' ))
        }
      }).catch((err) => {
        ErrorDialog.raise('Error parsing json: ' + err.toString())
      })
    }).catch((err) => {
      ErrorDialog.raise('Error fetching data: ' + err.toString())
    })
  }, [userContextValue.user]);

  useEffect(() => {
    if (state.newItem) {
      const { id, name } = state.newItem;
      combo.current!.value = { value: id!, text: name! };
      combo.current!.dispatchEvent(new CustomEvent('selected', { detail: { selected: id } }));
    }
  }, [state.newItem]);

  function onDsSelected(value: string, _event: CustomEvent) {
    // special handling for creating new ds
    if (value === 'new') {
      setState({ ...state, creatingNew: true });
      return;
    }

    // pass DS list record (meta information about DS)
    const meta = state.index[value] || { id: value };

    dsValue.current = combo.current!.value;
    const { onDsSelected } = props;
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
        newItem: { id, name }
      };
    }

    setState(newState);
  }

  const onCancelDsCreate = () => {
    setState({ ...state, creatingNew: undefined });
    combo.current!.value = dsValue.current;
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
        ref={combo}
        disabled={isVal(loading)}
        onselected={(e: CustomEvent) => onDsSelected(e.detail?.selected, e)}
    >
      {renderItem({ id: 'new', 'name': 'New', type: 'New' })}
      {list.map(
          item => renderItem(item)
      )}
    </wired-combo>
  </div>
}

export default DsList;
