import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const EditableNumber = forwardRef(({
  name,
  value,
  onChange,
  onKeyDown,
  disabled,
  min,
  max,
  step = 1,
  error,
  ...props
}, ref) => {
  const handleChange = (e) => {
    if (onChange) onChange(e);
  };

  return (
    <input
      ref={ref}
      type="number"
      name={name}
      value={value || ''}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      className={`editable-field__input editable-field__input--number ${error ? 'has-error' : ''}`}
      {...props}
    />
  );
});

EditableNumber.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  disabled: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  error: PropTypes.string
};

EditableNumber.displayName = 'EditableNumber';

export default EditableNumber;