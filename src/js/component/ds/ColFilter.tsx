import React, { Dispatch, useRef } from 'react';
import Icon from '../../icon/Icon';
import Dropdown, { DropdownElement } from '../common/Dropdown';
import { DsInfoAction, DsInfoActionType } from '../../reducer/dsInfo-reducer';
import { ColInfo, Filtering, Grouping } from '../../model/ds';

interface ColFilterProps {
  colInfo: ColInfo,
  dispatchDsInfo: Dispatch<DsInfoAction>;
}

const ColFilter = ({ colInfo, dispatchDsInfo }: ColFilterProps) => {

  const dropdownRef = useRef<DropdownElement | null>(null);

  const onGroupingSelected = (event: CustomEvent) => {
    dispatchDsInfo({
      type: DsInfoActionType.SELECT_GROUPING,
      col: colInfo.name,
      key: event.detail.selected
    });
    dropdownRef.current!.collapse();
  };

  const renderGroupings = (groupings: Grouping[] | undefined, selectedGrouping: Grouping | undefined) => {
    if (!groupings) {
      return null;
    }

    return <div className="col-filter-pane-item" key="groupings">
      <span className="col-filter-hint">Group by...</span>
      <wired-listbox
        selected={selectedGrouping?.key}
        onselected={onGroupingSelected}
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

  const renderFilterings = (filterings: Filtering[] | undefined, selectedGrouping: Grouping | undefined) => {
    if (!selectedGrouping) {
      // without applied grouping we can't format filtering for now.
      // todo fix it, pass all information necessary to filtering in ColInfo
      return null;
    }

    const makeFilterElement = (text: string, active: any, activate: (() => any) | undefined) => {
      return <span className="col-filter-element" key={text}>
        {active ? <b>{text}</b> : <a href="#" onClick={activate}>{text}</a>}
      </span>;
    };

    const isUncategorizedFiltering = (filtering: Filtering) => {
      return filtering.values!.length === 1 && filtering.values![0] == null;
    };

    const filterElements = [];

    filterElements.push(makeFilterElement(
      '<All>',
      !filterings,
      () => {
        dispatchDsInfo({
          type: DsInfoActionType.DROP_FILTER,
          col: colInfo.name
        });
        dropdownRef.current!.collapse();
      }
    ));

    filterElements.push(makeFilterElement(
      '<Uncategorized>',
      filterings?.find(filtering => isUncategorizedFiltering(filtering) &&
        filtering.key === selectedGrouping.key),
      () => {
        dispatchDsInfo({
          type: DsInfoActionType.FILTER,
          col: colInfo.name,
          key: selectedGrouping.key,
          values: [null]
        });
        dropdownRef.current!.collapse();
      }
    ));

    return <div className="col-filter-pane-item" key="filterings">
      <span className="col-filter-hint">Filter by {selectedGrouping.key}</span>
      {filterElements}
    </div>;
  }

  const selectedGrouping = colInfo.groupings?.find(grouping => grouping.selected);
  const icon = selectedGrouping ? Icon.filterSelected : Icon.filter;

  return <Dropdown
    ref={dropdownRef}
    className="col-filter"
    toggle={<img className="col-icon" src={icon} alt={`Group by ${colInfo.name}`}/>}
    content={[
      renderGroupings(colInfo.groupings, selectedGrouping),
      renderFilterings(colInfo.filterings, selectedGrouping),
    ]}
  />;
}

export default ColFilter;
