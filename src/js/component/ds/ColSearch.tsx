import React, { useEffect, useRef } from 'react';
import { WiredSearchInput } from '/wired-elements/lib/wired-search-input';
import { SearchFilter } from '../../model/ds';

interface ColSearchProps {
  filter: SearchFilter;

  onFilter(): void;
}

const ColSearch = ({ filter, onFilter }: ColSearchProps) => {
  const inputRef = useRef<WiredSearchInput | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onChange = () => {
    const term = inputRef.current?.value;
    filter.term = term;
    onFilter();
  }

  return <>
    <span className="col-action-hint">Look up...</span>
    <wired-search-input
        style={{ width: '100%' }}
        ref={inputRef}
        value={filter.term}
        onInput={onChange}
        onclose={onChange}
    />
  </>;
}

export default ColSearch;
