import React, { Component } from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import 'wired-listbox';
import 'wired-item';
import types from '../../helper/types';
import Icon from '../Icon';
import { actionType } from '../../reducer/dsInfo-reducer';

class ColFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.onClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutside);
  }

  componentDidUpdate() {
    if (this.groupings) {
      this.groupings.addEventListener('selected', this.onGroupingSelected);
    }

    // relocate filter pane if it happened behind the left boundary of content
    const colFilter = ReactDom.findDOMNode(this);
    const colSpace = colFilter.parentElement;
    const left = colSpace.offsetLeft + colFilter.offsetLeft;

    if (left < 0 && this.colFilterPane) {
      this.colFilterPane.style.left = `${-left}px`;
    }
  }

  onOpen = () => {
    this.setState({ open: !this.state.open });
  };

  onClickOutside = (event) => {
    if (!this.dropdown.contains(event.target) && this.state.open) {
      this.setState({ open: false });
    }
  };

  onGroupingSelected = (event) => {
    const { colSpec, dispatchDsInfo } = this.props;
    dispatchDsInfo({
      type: actionType.SELECT_GROUPING,
      col: colSpec.name,
      key: event.detail.selected
    });
    this.setState({ open: false });
  };

  renderGroupings(groupings, selectedGrouping) {
    if (!groupings) {
      return '';
    }

    return <div className="col-filter-pane-item" key="groupings">
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

  renderFilterings(filterings, selectedGrouping) {
    if (!selectedGrouping) {
      return '';
    }

    const { colSpec, dispatchDsInfo } = this.props;

    const makeFilterElement = (text, active, activate) => {
      return <span className="col-filter-element" key={text}>
        {active ? <b>{text}</b> : <a href="#" onClick={activate}>{text}</a>}
      </span>;
    };

    const filterElements = [];
    filterElements.push(makeFilterElement(
      '<All>',
      !filterings,
      () => {
        dispatchDsInfo({
          type: actionType.DROP_FILTER,
          col: colSpec.name
        });
        this.setState({ open: false });
      }
    ));

    const isUncategorizedFiltering = (filtering) => {
      return filtering.values.length === 1 && filtering.values[0] == null;
    };

    filterElements.push(makeFilterElement(
      '<Uncategorized>',
      filterings?.find(filtering => isUncategorizedFiltering(filtering) &&
        filtering.key === selectedGrouping.key),
      () => {
        dispatchDsInfo({
          type: actionType.FILTER,
          col: colSpec.name,
          key: selectedGrouping.key,
          values: [null]
        });
        this.setState({ open: false });
      }
    ));
    if (filterings) {
      filterings.forEach(filtering => {
        if (!isUncategorizedFiltering(filtering)) {
          filterElements.push(makeFilterElement(
            filtering.values.join(' || '),
            true,
            undefined
          ));
        }
      });
    }

    return <div className="col-filter-pane-item" key="filterings">
      <span className="col-filter-hint">Filters</span>
      {filterElements}
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
          <div
            ref={colFilterPane => this.colFilterPane = colFilterPane}
            className="col-filter-pane"
          >
            {this.renderGroupings(colSpec.groupings, selectedGrouping)}
            {this.renderFilterings(colSpec.filterings, selectedGrouping)}
          </div> :
          ''
      }
    </div>;
  }
}

ColFilter.propTypes = {
  colSpec: types.colSpec.isRequired,
  dispatchDsInfo: PropTypes.func
};

export default ColFilter;
