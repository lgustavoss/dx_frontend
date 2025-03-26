import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const EditableText = forwardRef(({
  name,
  value,
  onChange,
  onKeyDown,
  disabled,
  multiline = false,
  rows = 3,
  error,
  ...props
}, ref) => {
  const handleChange = (e) => {
    if (onChange) onChange(e);
  };

  if (multiline) {
    return (
      <textarea
        ref={ref}
        name={name}
        value={value || ''}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className={`editable-field__textarea ${error ? 'has-error' : ''}`}
        rows={rows}
        {...props}
      />
    );
  }

  return (
    <input
      ref={ref}
      type="text"
      name={name}
      value={value || ''}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      disabled={disabled}
      className={`editable-field__input ${error ? 'has-error' : ''}`}
      {...props}
    />
  );
});

EditableText.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  disabled: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  error: PropTypes.string
};

EditableText.displayName = 'EditableText';

export default EditableText;