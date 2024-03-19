import React from 'react';
import { RangeFilter } from '../../model/ds';

interface ColRangeFilterProps {
  filter: RangeFilter;

  onFilter(): void;
}

const ColRangeFilter = (props: ColRangeFilterProps) => {

  const { filter, onFilter } = props;

  function onChangeRange(range: { min: number, max: number }) {
    filter.range_min = range.min;
    filter.range_max = range.max;
    filter.all = false;
    filter.uncategorized = false;
    filter.outliers = false;
    onFilter();
  }

  function onSetAll(all: boolean) {
    filter.all = all;
    if (all) {
      filter.uncategorized = false;
      filter.outliers = false;
    }
    onFilter();
  }

  function onSetUncategorized(uncategorized: boolean) {
    filter.uncategorized = uncategorized;
    if (uncategorized) {
      filter.all = false;
      filter.outliers = false;
    }
    onFilter();
  }

  function onSetOutliers(outliers: boolean) {
    filter.outliers = outliers;
    if (outliers) {
      filter.all = false;
      filter.uncategorized = false;
    }
    onFilter();
  }

  return <>
    <span className="col-action-hint">Filter by range</span>
    <wired-dual-slider
        style={{ width: '100%' }}
        min={filter.min}
        max={filter.max}
        step={filter.max - filter.min > 1 ? 1 :
            Math.pow(10, Math.floor(Math.log10(filter.max - filter.min)))}
        value={{ min: filter.range_min, max: filter.range_max }}
        greyed={filter.all || filter.uncategorized || filter.outliers}
        label-enabled={true}
        label-format={filter.labelformat || 'number'}
        onchange={(event) => onChangeRange(event.detail.value)}
    />
    <div>
      <wired-checkbox
          key="all"
          name="all"
          checked={filter.all}
          onchange={(event) => onSetAll(event.detail.checked)}
      >all
      </wired-checkbox>
      {' '}
      <wired-checkbox
          key="uncategorized"
          name="uncategorized"
          checked={filter.uncategorized}
          onchange={(event) => onSetUncategorized(event.detail.checked)}
      >uncategorized
      </wired-checkbox>
      {' '}
      <wired-checkbox
          key="outliers"
          name="outliers"
          checked={filter.outliers}
          onchange={(event) => onSetOutliers(event.detail.checked)}
      >outliers
      </wired-checkbox>
    </div>
  </>;
}

export default ColRangeFilter;
