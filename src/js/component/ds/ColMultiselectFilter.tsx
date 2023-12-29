import React from 'react';
import equal from 'deep-equal';
import Uniselector from '../common/Uniselector';
import { ComplexValueType, MultiselectFilter, ValueType } from '../../model/ds';
import { select } from '../../helper/json-helper';

interface ColMultiselectFilterProps<T> {
  filter: MultiselectFilter<T>;

  onFilter(): any;
}

const ColMultiselectFilter = <T extends ValueType | ComplexValueType>(
    {
      filter,
      onFilter
    }: ColMultiselectFilterProps<T>
) => {
  const ALL = '<all>';
  const UNCATEGORIZED = '<uncategorized>';

  if (filter.values.length === 0) {
    return <span className="error">No values</span>
  }

  const index: { [id: string]: T } = {};

  const values = [
    { value: ALL, text: ALL },
    { value: UNCATEGORIZED, text: UNCATEGORIZED }
  ].concat(
      filter.values.map((value) => {
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
        text: select(filter.labelselector, value) || id
      };
    }
  }

  function selectValue(v: T) {
    filter.selected.push(v);
  }

  function removeValue(v: T) {
    filter.selected = filter.selected.filter(v1 => !equal(v, v1));
  }

  function removeAll() {
    filter.selected = [];
  }

  const onValueSelected = (e: CustomEvent) => {
    e.stopPropagation();
    const id = e.detail.selected;

    if (id === ALL) {
      removeAll();
    } else if (id === UNCATEGORIZED) {
      // @ts-ignore
      selectValue(null);
    } else {
      selectValue(index[id]);
    }

    onFilter();
  }

  return <>
    <span className="col-action-hint">Filter by {filter.label}</span>
    <wired-combo-lazy
        style={{ width: '100%' }}
        values={values}
        selected={
          !filter.selected.length ?
              ALL :
              getCanonicalValue(filter.selected[filter.selected.length - 1]).value
        }
        onselected={onValueSelected}
    />
    <div>
      {filter.selected.map((value) => {
        let text = getCanonicalValue(value).text;
        return <>
          <Uniselector
              selected={false}
              onClick={() => {
                removeValue(value);
                onFilter();
              }}
          >{text}❌</Uniselector>
        </>
      })}
    </div>
  </>
};

export default ColMultiselectFilter;
