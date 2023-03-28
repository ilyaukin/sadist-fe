import React, { Dispatch, useEffect, useState } from 'react';
import equal from 'deep-equal';
import Uniselector from '../common/Uniselector';
import {
  ComplexValueType,
  MultiselectFilterProposal,
  ValueType
} from '../../model/ds';
import { DsInfoAction, DsInfoActionType } from '../../reducer/dsInfo-reducer';
import { isVal } from '../../helper/wired-helper';

interface ColMultiselectFilterProps<T> {
  dsId: string;
  filterProposal: MultiselectFilterProposal<T>;
  dispatchDsInfo: Dispatch<DsInfoAction>;
}

const ColMultiselectFilter = <T extends ValueType | ComplexValueType>({
                                                                        dsId,
                                                                        filterProposal,
                                                                        dispatchDsInfo
                                                                      }: ColMultiselectFilterProps<T>) => {

  const [loading, setLoading] = useState(false);

  const ALL = '<all>';
  const UNCATEGORIZED = '<uncategorized>';

  useEffect(() => {
    if (filterProposal.values.length === 0) {
      setLoading(true);
      fetch(`/ds/${dsId}/label-values?col=${encodeURIComponent(filterProposal.col)}&label=${encodeURIComponent(filterProposal.label)}`)
          .then((result) => result.json())
          .then(data => {
            if (data.success && data.list) {
              filterProposal.values = data.list;
              setLoading(false);
            }
          });
    }
  }, []);

  const index: { [id: string]: T } = {};

  const values = [
    { value: ALL, text: ALL },
    { value: UNCATEGORIZED, text: UNCATEGORIZED }
  ].concat(
      filterProposal.values.map((value) => {
        let combovalue = getCanonicalValue(value);
        index[combovalue.value] = value;
        return combovalue;
      }));

  function getCanonicalValue(value: T): { value: string, text: string } {
    let id;
    if (typeof value == 'string' || typeof value == 'number' || typeof value == 'boolean') {
      id = `${value}`;
      return { value: id, text: id };
    } else if (value == null) {
      id = UNCATEGORIZED;
      return { value: id, text: UNCATEGORIZED };
    } else {
      id = `${value.id}`;
      return {
        value: id,
        text: filterProposal.getLabel?.(value) || id
      };
    }
  }

  function selectValue(v: T) {
    filterProposal.selected.push(v);
  }

  function removeValue(v: T) {
    filterProposal.selected = filterProposal.selected.filter(v1 => !equal(v, v1));
  }

  function removeAll() {
    filterProposal.selected = [];
  }

  function dispatchFilter() {
    dispatchDsInfo({
      type: filterProposal.selected.length === 0 ? DsInfoActionType.DROP_FILTER : DsInfoActionType.ADD_FILTER,
      filter: filterProposal.propose(),
    });
  }

  const onValueSelected = (e: CustomEvent) => {
    e.stopPropagation();
    const id = e.detail.selected;

    if (id === ALL) {
      removeAll();
    } else if (id === UNCATEGORIZED) {
      selectValue(null as T);
    } else {
      selectValue(index[id]);
    }

    dispatchFilter();
  }

  return <>
    <wired-combo-lazy
        // @ts-ignore
        style={{ width: '100%' }}
        disabled={isVal(loading)}
        values={values}
        onselected={onValueSelected}
    />
    {filterProposal.selected.map((value) => {
      let text = getCanonicalValue(value).text;
      return <Uniselector
          selected={false}
          onClick={() => {
            removeValue(value);
            dispatchFilter();
          }}
      >{`${text}❌`}</Uniselector>
    })}
  </>
};

export default ColMultiselectFilter;
