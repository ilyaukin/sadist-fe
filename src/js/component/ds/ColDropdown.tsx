import React, { Dispatch, useEffect, useRef } from 'react';
import Icon from '../../icon/Icon';
import Dropdown, { DropdownElement } from '../common/Dropdown';
import ColSearch from './ColSearch';
import ColMultiselectFilter from './ColMultiselectFilter';
import { DsInfoAction, DsInfoActionType } from '../../reducer/dsInfo-reducer';
import { ComplexValueType, DsInfo, ValueType } from '../../model/ds';

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
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollHandler = () => {
      if (contentRef.current) {
        contentRef.current.style.transform = `translateY(-${window.scrollY}px)`;
      }
    }
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);

  const renderVizProposal = () => {
    if (!vizMetaProposed) {
      return null;
    }

    return <div className="col-dropdown-pane-item" key="viz">
      <span className="col-action-hint">Visualize...</span>
      <wired-listbox
        style={{ width: '100%' }}
        onselected={(event) => {
          const key = event.detail.selected;
          const vizMeta = vizMetaProposed?.find(v => v.key === key)!;
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
              <ColSearch
                  filterProposal={filterProposal}
                  dispatchDsInfo={dispatchDsInfo}
              />
            </>
          case 'multiselect':
            return <>
              <span className="col-action-hint">Filter by {filterProposal.label}</span>
              <ColMultiselectFilter<ValueType | ComplexValueType>
                  dsId={dsInfo.meta.id!}
                  filterProposal={filterProposal}
                  dispatchDsInfo={dispatchDsInfo}
              />
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
    content={<div ref={contentRef} className="col-dropdown-content">
      {renderVizProposal()}
      {renderFilterProposal()}
    </div>}
  />;
}

export default ColDropdown;
