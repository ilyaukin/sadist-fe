/**
 Prop types that are common for several components
 */

import PropTypes from 'prop-types';

// info on table column, possible and applied grouping and filtering
const colSpec = PropTypes.shape({
  name: PropTypes.string.isRequired,
  // groupings that are available for this column
  groupings: PropTypes.arrayOf(
    PropTypes.shape({
      // grouping key relatively to `details` field
      key: PropTypes.string,
      // if grouping is selected
      selected: PropTypes.bool
    })
  ),
  // filters that are applied to this column
  filterings: PropTypes.arrayOf(
    PropTypes.shape({
      // filtering key relatively to `details` field
      key: PropTypes.string,
      // filtering value
      values: PropTypes.arrayOf(PropTypes.string)
    })
  )
});

const colSpecs = PropTypes.arrayOf(colSpec);

export default { colSpec, colSpecs };
