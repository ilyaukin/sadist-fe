import React, { Component } from 'react';
import PropTypes from "prop-types";
import "/packages/wired-combo";
import "/packages/wired-item";
import "/packages/wired-dialog";
import ErrorDialog from "../common/ErrorDialog";
import Icon from "../Icon";
import DsNew from "./DsNew";
import { isVal } from "../../helper/wired-helper";
import CancelableDialog from "../common/CancelableDialog";

class DsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      loading: true
    }
  }

  componentDidMount() {
    fetch('/ls').then((response) => {
      response.json().then((data) => {
        if (data.success && data.list) {
          this.setState({
            list: data.list,
            loading: false
          });
        } else {
          ErrorDialog.raise('Error: ' + (data.error || 'Unknown error'))
        }
      }).catch((err) => {
        ErrorDialog.raise('Error parsing json: ' + err.toString())
      })
    }).catch((err) => {
      ErrorDialog.raise('Error fetching data: ' + err.toString())
    })

    // wired-combo does not have react-native events, so doing this way
    this.combo.addEventListener('selected', (e) => this.onDsSelected(e, e.detail?.selected))
  }

  onDsSelected(event, value) {
    // special handling for creating new ds
    if (value === 'new') {
      this.setState({ creatingNew: true });
      return;
    }

    // pass DS list record (meta information about DS)
    const meta = this.state.list.find(item => item.id === value)
      || {id: value};

    const { onDsSelected } = this.props;
    this.dsValue = this.combo.value;
    onDsSelected(meta);
  }

  onDsCreated = (item) => {
    this.setState({ creatingNew: undefined }, () => {
      // add {id, name} to the list (or request the list
      // from the server again - dunno what's better).
      const { id, name } = item;

      if (!id || !name) {
        ErrorDialog.raise('Got invalid item from server: ' + JSON.stringify(item));
      } else {
        let list = this.state.list;
        // remove item with the same name, if any, (if we already uploaded
        // this data source, probably should ask to override/rename)
        list = list.filter(item => item.name !== name);
        // add new item
        list = [...list, item];
        this.setState({ list }, () => {
          this.combo.value = { value: id, text: name };
          this.combo.dispatchEvent(new CustomEvent('selected', { detail: { selected: id } }));
        })
      }
    })
  }

  onCancelDsCreate = () => {
    this.setState({ creatingNew: undefined }, () => {
      this.combo.value = this.dsValue;
    })
  }

  renderItem(item) {
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

  render() {
    // console.log(this.state)
    const { loading, list, creatingNew } = this.state;

    return <div style={{ margin: '10px' }}>
      <CancelableDialog open={creatingNew} onCancel={this.onCancelDsCreate}>
        <DsNew onDsCreated={this.onDsCreated}/>
      </CancelableDialog>
      <wired-combo disabled={isVal(loading)} ref={(combo) => this.combo = combo}>
        {this.renderItem({ id: 'new', 'name': 'New', type: 'New' })}
        {list.map(
          item => this.renderItem(item)
        )}
      </wired-combo>
    </div>
  }
}

DsList.propTypes = {
  onDsSelected: PropTypes.func
}

export default DsList;
