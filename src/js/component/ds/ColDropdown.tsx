import React, { Dispatch, useRef } from 'react';
import Icon from '../../icon/Icon';
import Dropdown, { DropdownElement } from '../common/Dropdown';
import { DsInfoAction, DsInfoActionType } from '../../reducer/dsInfo-reducer';
import { Filter, FilterProposal, VizMeta } from '../../model/ds';
import equal from 'deep-equal';
import ColSearch from './ColSearch';
import ColMultiselectFilter from './ColMultiselectFilter';

interface ColFilterProps {
  col: string;
  vizMetaProposed?: VizMeta[];
  vizMeta?: VizMeta;
  filterProposals?: FilterProposal[];
  filters?: Filter[];
  dispatchDsInfo: Dispatch<DsInfoAction>;
}

const ColDropdown = (
  {
    col,
    vizMetaProposed,
    vizMeta,
    filterProposals,
    filters,
    dispatchDsInfo
  }: ColFilterProps
) => {

  const dropdownRef = useRef<DropdownElement | null>(null);

  const renderVizProposal = () => {
    if (!vizMetaProposed) {
      return null;
    }

    const __getSelectedKey = (vizMeta: VizMeta): string | undefined => {
      for (let proposedVizMeta of vizMetaProposed) {
        if (equal(proposedVizMeta.props, vizMeta.props)) {
          return proposedVizMeta.key;
        }
      }
      return vizMeta.children ?
        Object.values(vizMeta.children).map(__getSelectedKey).find(key => !!key) :
        undefined;
    }
    const selectedKey = vizMeta ? __getSelectedKey(vizMeta) : undefined;

    return <div className="col-dropdown-pane-item" key="viz">
      <span className="col-action-hint">Visualize...</span>
      <wired-listbox
        //@ts-ignore
        style={{ width: '100%' }}
        selected={selectedKey}
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
          <wired-item key={vizMeta.key} value={vizMeta.key}>
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
