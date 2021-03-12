import React, { Component } from 'react'
import PropTypes from 'prop-types'
import types from '../../helper/types'
import Icon from '../Icon'
import { actionType } from '../../reducer/dsInfo-reducer'

class ColFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  componentDidMount() {
    document.addEventListener("click", this.onClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.onClickOutside)
  }

  componentDidUpdate() {
    if (this.groupings) {
      this.groupings.addEventListener("selected", this.onGroupingSelected)
    }
  }

  onOpen = () => {
    this.setState({ open: !this.state.open });
  };

  onClickOutside = (event) => {
    if (!this.dropdown.contains(event.target) && this.state.open) {
      this.setState({ open: false });
    }
  }

  onGroupingSelected = (event) => {
    const { colSpec, dispatchDsInfo } = this.props;
    dispatchDsInfo({
      type: actionType.SELECT_GROUPING,
      col: colSpec.name,
      key: event.detail.selected
    });
    this.setState({ open: false });
  }

  renderGroupings(groupings, selectedGrouping) {
    if (!groupings) {
      return '';
    }

    return <div className="col-filter-pane-item">
      <span className="col-filter-hint">Available grouping</span>
      <wired-listbox
        ref={groupings => this.groupings = groupings}
        selected={selectedGrouping?.key}
      >
        {groupings.map(grouping => <wired-item
          key={grouping.key}
          value={grouping.key}
        >
          {grouping.key}
        </wired-item>)}
      </wired-listbox>
    </div>;
  }

  render() {
    const { colSpec } = this.props;
    const { open } = this.state;

    const selectedGrouping = colSpec.groupings
      .find(grouping => grouping.selected);
    const icon = selectedGrouping ? Icon.filterSelected : Icon.filter;

    return <div className="col-filter">
      <div style={{ width: "100%" }}>
        <a ref={(dropdown => this.dropdown = dropdown)} href='#' onClick={this.onOpen}>
          <img className="col-icon" src={icon} alt={`Group by ${colSpec.name}`}/>
        </a>
      </div>
      {
        open ?
          <div className="col-filter-pane">
            {this.renderGroupings(colSpec.groupings, selectedGrouping)}
          </div> :
          ''
      }
    </div>
  }
}

ColFilter.propTypes = {
  colSpec: types.colSpec.isRequired,
  dispatchDsInfo: PropTypes.func
}

export default ColFilter;
