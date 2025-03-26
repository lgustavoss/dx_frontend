import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const EditableDate = forwardRef(({
  name,
  value,
  onChange,
  onKeyDown,
  disabled,
  min,
  max,
  error,
  ...props
}, ref) => {
  const handleChange = (e) => {
    if (onChange) onChange(e);
  };

  return (
    <input
      ref={ref}
      type="date"
      name={name}
      value={value || ''}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      disabled={disabled}
      min={min}
      max={max}
      className={`editable-field__input editable-field__input--date ${error ? 'has-error' : ''}`}
      {...props}
    />
  );
});

EditableDate.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  disabled: PropTypes.bool,
  min: PropTypes.string,
  max: PropTypes.string,
  error: PropTypes.string
};

EditableDate.displayName = 'EditableDate';

export default EditableDate;