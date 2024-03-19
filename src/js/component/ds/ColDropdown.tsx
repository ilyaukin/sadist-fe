import React, { Dispatch, useEffect, useRef } from 'react';
import Icon from '../../icon/Icon';
import Dropdown, { DropdownElement } from '../common/Dropdown';
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
  const vizMetaProposed = dsInfo.vizMetaProposedByCol?.[col];
  const filters = dsInfo.filtersByCol?.[col];

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
              {vizMeta.stringrepr}
            </wired-item>
        ))}
      </wired-listbox>
    </div>;
  }

  const renderFilterProposal = () => {
    if (!filters) {
      return null;
    }

    return <div className="col-filter-pane-item" key="filter">
      {filters.map((filter) => (
          <filter.render
              // @ts-ignore  TS can't calculate this :(
              filter={filter}
              onFilter={() => {
                dispatchDsInfo({ type: DsInfoActionType.APPLY_FILTER });
              }}
          />
      ))}
    </div>
  }

  const isSelected = !!filters?.find(f => f.q());
  const icon = isSelected ? Icon.filterSelected : Icon.filter;

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
