import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import types from '../../helper/types';
import Icon from '../../icon/Icon';
import { actionType } from '../../reducer/dsInfo-reducer';
import Dropdown from '../common/Dropdown';
import WiredListbox from '../common/WiredListbox';
import WiredItem from '../common/WiredItem';

const ColFilter = ({ colSpec, dispatchDsInfo }) => {

  const dropdownRef = useRef();

  const onGroupingSelected = (event) => {
    dispatchDsInfo({
      type: actionType.SELECT_GROUPING,
      col: colSpec.name,
      key: event.detail.selected
    });
    dropdownRef.current.collapse();
  };

  const renderGroupings = (groupings, selectedGrouping) => {
    if (!groupings) {
      return '';
    }

    return <div className="col-filter-pane-item" key="groupings">
      <span className="col-filter-hint">Group by...</span>
      <WiredListbox
        selected={selectedGrouping?.key}
        onSelected={onGroupingSelected}
      >
        {groupings.map(grouping => <WiredItem
          key={grouping.key}
          value={grouping.key}
        >
          {grouping.key}
        </WiredItem>)}
      </WiredListbox>
    </div>;
  }

  const renderFilterings = (filterings, selectedGrouping) => {
    if (!selectedGrouping) {
      return '';
    }

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
        dropdownRef.current.collapse();
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
        dropdownRef.current.collapse();
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
      <span className="col-filter-hint">Filter by {selectedGrouping.key}</span>
      {filterElements}
    </div>;
  }

  const selectedGrouping = colSpec.groupings
    .find(grouping => grouping.selected);
  const icon = selectedGrouping ? Icon.filterSelected : Icon.filter;

  return <Dropdown
    ref={dropdownRef}
    className="col-filter"
    toggle={<img className="col-icon" src={icon} alt={`Group by ${colSpec.name}`}/>}
    content={[
      renderGroupings(colSpec.groupings, selectedGrouping),
      renderFilterings(colSpec.filterings, selectedGrouping),
    ]}
  />;
}

ColFilter.propTypes = {
  colSpec: types.colSpec.isRequired,
  dispatchDsInfo: PropTypes.func
};

export default ColFilter;
