import React, { Dispatch, useEffect, useRef } from 'react';
import { WiredSearchInput } from '/packages/wired-search-input';
import { SearchFilterProposal } from '../../model/ds';
import { DsInfoAction, DsInfoActionType } from '../../reducer/dsInfo-reducer';

interface ColSearchProps {
  filterProposal: SearchFilterProposal;
  dispatchDsInfo: Dispatch<DsInfoAction>;
}

const ColSearch = ({ filterProposal, dispatchDsInfo }: ColSearchProps) => {
  const inputRef = useRef<WiredSearchInput | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onChange = () => {
    const term = inputRef.current?.value;
    filterProposal.term = term;
    dispatchDsInfo({
      type: term ? DsInfoActionType.ADD_FILTER : DsInfoActionType.DROP_FILTER,
      filter: filterProposal.propose(),
    });
  }

  return <wired-search-input
      // @ts-ignore
      style={{ width: '100%' }}
      ref={inputRef}
      value={filterProposal.term}
      onInput={onChange}
      onclose={onChange}
  />;
}

export default ColSearch;
