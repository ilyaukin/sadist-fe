import React, { Dispatch, useRef } from 'react';
import Icon from '../../icon/Icon';
import Dropdown, { DropdownElement } from '../common/Dropdown';
import ColSearch from './ColSearch';
import ColMultiselectFilter from './ColMultiselectFilter';
import { DsInfoAction, DsInfoActionType } from '../../reducer/dsInfo-reducer';
import { DsInfo } from '../../model/ds';

interface ColFilterProps {
  col: string;
  dsInfo: DsInfo;
  dispatchDsInfo: Dispatch<DsInfoAction>;
}

const ColDropdown = (
  {
    col,
    dsInfo,
    dispatchDsInfo
  }: ColFilterProps
) => {

  const { filters } = dsInfo;
  const vizMetaProposed = dsInfo.vizMetaProposedByCol?.[col];
  const filterProposals = dsInfo.filterProposalsByCol?.[col];

  const dropdownRef = useRef<DropdownElement | null>(null);

  const renderVizProposal = () => {
    if (!vizMetaProposed) {
      return null;
    }

    return <div className="col-dropdown-pane-item" key="viz">
      <span className="col-action-hint">Visualize...</span>
      <wired-listbox
        //@ts-ignore
        style={{ width: '100%' }}
        onselected={(event) => {
          const key = event.detail.selected;
          const vizMeta = vizMetaProposed?.find(v => v.key === key);
          dispatchDsInfo({
            type: DsInfoActionType.ADD_VIZ,
            vizMeta,
          });
          dropdownRef.current?.collapse();
        }}
      >
        {vizMetaProposed.map(vizMeta => (
          <wired-item
            key={vizMeta.key}
            value={vizMeta.key}
            selected={dsInfo.isVizSelected(vizMeta)}
          >
            {vizMeta.toString()}
          </wired-item>
        ))}
      </wired-listbox>
    </div>;
  }

  const renderFilterProposal = () => {
    if (!filterProposals) {
      return null;
    }

    return <div className="col-filter-pane-item" key="filter">
      {filterProposals.map((filterProposal) => {
        switch (filterProposal.type) {
          case 'search':
            return <>
              <span className="col-action-hint">Look up...</span>
              <ColSearch filterProposal={filterProposal}/>
            </>
          case 'multiselect':
            return <>
              <span className="col-action-hint">Filter by ${filterProposal.label}</span>
              <ColMultiselectFilter filterProposal={filterProposal}/>
            </>
        }
      })}
    </div>
  }

  const selectedFilter = filters?.find(f => f.col === col);
  const icon = selectedFilter ? Icon.filterSelected : Icon.filter;

  return <Dropdown
    ref={dropdownRef}
    className="col-dropdown"
    toggle={<img className="col-icon" src={icon} alt={''}/>}
    content={<>
      {renderVizProposal()}
      {renderFilterProposal()}
    </>}
  />;
}

export default ColDropdown;
