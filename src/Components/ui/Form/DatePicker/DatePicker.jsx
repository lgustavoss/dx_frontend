import React, { useState, useRef, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import './DatePicker.css';
import { formatDate } from '../../../../utils/formatters';

/**
 * Componente DatePicker reutilizável 
 * Permite seleção de data através de input ou calendário visual
 */
const DatePicker = forwardRef(({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  required,
  disabled,
  readOnly,
  placeholder = "DD/MM/AAAA",
  minDate,
  maxDate,
  yearRange = 100,
  showClearButton = true,
  errorMessage,
  fullWidth = false,
  className = '',
  variant = 'default', // 'default', 'error', 'success'
  ...props
}, ref) => {
  // Estado interno para controlar o valor do input
  const [inputValue, setInputValue] = useState('');
  
  // Estado para controlar a visualização do calendário
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Estado para controlar o mês/ano visualizados no calendário
  const [viewDate, setViewDate] = useState(new Date());
  
  // Estado para controlar foco
  const [isFocused, setIsFocused] = useState(false);
  
  // Refs para componentes
  const calendarRef = useRef(null);
  const inputRef = useRef(null);
  
  // Função auxiliar para converter string em data
  const parseDate = (dateString) => {
    if (!dateString) return null;
    
    // Se já for um objeto Date, retorna ele mesmo
    if (dateString instanceof Date) return dateString;
    
    // Se for formato ISO (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
      return new Date(dateString);
    }
    
    // Se for formato brasileiro (DD/MM/YYYY)
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    
    return null;
  };
  
  // Gerar os dias para o mês atual no calendário
  const generateCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    // Primeiro dia do mês
    const firstDayOfMonth = new Date(year, month, 1);
    // Último dia do mês
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Ajusta para começar na semana correta
    const daysFromPrevMonth = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Criar array com os dias do mês anterior para preencher primeira semana
    const prevMonthDays = [];
    if (daysFromPrevMonth > 0) {
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
        prevMonthDays.push({
          day: prevMonthLastDay - i,
          month: month - 1,
          year: month === 0 ? year - 1 : year,
          isCurrentMonth: false
        });
      }
    }
    
    // Criar array com os dias do mês atual
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        day: i,
        month,
        year,
        isCurrentMonth: true
      });
    }
    
    // Criar array com os dias do próximo mês para completar
    const nextMonthDays = [];
    const totalDaysDisplayed = prevMonthDays.length + currentMonthDays.length;
    const remainingDays = 42 - totalDaysDisplayed; // 6 semanas completas (7 * 6 = 42)
    
    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push({
        day: i,
        month: month + 1 > 11 ? 0 : month + 1,
        year: month + 1 > 11 ? year + 1 : year,
        isCurrentMonth: false
      });
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };
  
  // Verificar se uma data é selecionável
  const isDateSelectable = (day, month, year) => {
    const date = new Date(year, month, day);
    
    // Verificar data mínima
    if (minDate) {
      const minDateObj = parseDate(minDate);
      if (minDateObj && date < minDateObj) return false;
    }
    
    // Verificar data máxima
    if (maxDate) {
      const maxDateObj = parseDate(maxDate);
      if (maxDateObj && date > maxDateObj) return false;
    }
    
    return true;
  };
  
  // Verificar se uma data está selecionada
  const isDateSelected = (day, month, year) => {
    if (!value) return false;
    
    const selectedDate = parseDate(value);
    if (!selectedDate) return false;
    
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };
  
  // Efeito para sincronizar o estado interno com a prop value
  useEffect(() => {
    if (value) {
      const date = parseDate(value);
      if (date) {
        setInputValue(formatDate(date));
        setViewDate(date); // Atualiza o mês exibido no calendário
      } else {
        setInputValue('');
      }
    } else {
      setInputValue('');
    }
  }, [value]);
  
  // Efeito para fechar o calendário quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current && 
        !calendarRef.current.contains(event.target) && 
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setShowCalendar(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Manipulador de seleção de data
  const handleSelectDate = (day, month, year) => {
    if (!isDateSelectable(day, month, year)) return;
    
    const selectedDate = new Date(year, month, day);
    const formattedDate = formatDate(selectedDate);
    setInputValue(formattedDate);
    
    // Notificar mudança
    if (onChange) {
      // Formato ISO para o backend
      const isoDate = selectedDate.toISOString().split('T')[0];
      const syntheticEvent = {
        target: {
          name,
          value: isoDate
        }
      };
      onChange(syntheticEvent);
    }
    
    setShowCalendar(false);
  };
  
  // Manipulador de input manual
  const handleInputChange = (e) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);
    
    // Validação básica do formato de data
    const isValidDateFormat = /^(\d{2})\/(\d{2})\/(\d{4})$/.test(rawValue);
    
    if (isValidDateFormat) {
      const parts = rawValue.split('/');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      
      // Validar se a data é real
      const date = new Date(year, month, day);
      if (
        date.getDate() === day &&
        date.getMonth() === month &&
        date.getFullYear() === year &&
        isDateSelectable(day, month, year)
      ) {
        // Formato ISO para o backend
        const isoDate = date.toISOString().split('T')[0];
        
        if (onChange) {
          const syntheticEvent = {
            target: {
              name,
              value: isoDate
            }
          };
          onChange(syntheticEvent);
        }
        
        setViewDate(date);
      }
    }
  };
  
  // Mudança para o mês anterior no calendário
  const goToPreviousMonth = () => {
    setViewDate(prev => {
      const newMonth = prev.getMonth() - 1;
      const newYear = prev.getFullYear() + (newMonth < 0 ? -1 : 0);
      return new Date(newYear, newMonth < 0 ? 11 : newMonth, 1);
    });
  };
  
  // Mudança para o próximo mês no calendário
  const goToNextMonth = () => {
    setViewDate(prev => {
      const newMonth = prev.getMonth() + 1;
      const newYear = prev.getFullYear() + (newMonth > 11 ? 1 : 0);
      return new Date(newYear, newMonth > 11 ? 0 : newMonth, 1);
    });
  };
  
  // Manipulador para limpar a data
  const handleClearDate = () => {
    setInputValue('');
    if (onChange) {
      const syntheticEvent = {
        target: {
          name,
          value: ''
        }
      };
      onChange(syntheticEvent);
    }
  };
  
  // Obter os anos para o seletor de anos
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const halfRange = Math.floor(yearRange / 2);
    const startYear = currentYear - halfRange;
    const endYear = currentYear + halfRange;
    
    const years = [];
    for (let i = startYear; i <= endYear; i++) {
      years.push(i);
    }
    return years;
  };
  
  // Manipulador para mudança de mês no seletor
  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    setViewDate(prev => new Date(prev.getFullYear(), newMonth, 1));
  };
  
  // Manipulador para mudança de ano no seletor
  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);
    setViewDate(prev => new Date(newYear, prev.getMonth(), 1));
  };
  
  // Manipulador de foco
  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };
  
  // Manipulador de blur
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };
  
  // Nomes dos meses
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  // Nomes dos dias da semana
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  // Definir classes do input
  const getInputClasses = () => {
    let classes = 'date-input';
    
    if (variant === 'error') classes += ' date-input-error';
    if (variant === 'success') classes += ' date-input-success';
    if (disabled) classes += ' date-input-disabled';
    if (readOnly) classes += ' date-input-readonly';
    if (isFocused) classes += ' date-input-focused';
    
    return classes;
  };
  
  return (
    <div className={`datepicker-component ${fullWidth ? 'full-width' : ''} ${className}`}>
      {label && (
        <label htmlFor={id || name} className="datepicker-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
      
      <div className="datepicker-input-container">
        <input
          ref={inputRef}
          type="text"
          id={id || name}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={getInputClasses()}
          disabled={disabled}
          readOnly={readOnly}
          {...props}
        />
        
        {variant === 'error' && (
          <span className="input-status-icon error-icon">
            <FaExclamationCircle />
          </span>
        )}
        
        {variant === 'success' && (
          <span className="input-status-icon success-icon">
            <FaCheckCircle />
          </span>
        )}
        
        <button
          type="button"
          className="calendar-toggle"
          onClick={() => setShowCalendar(prev => !prev)}
          disabled={disabled || readOnly}
        >
          <FaCalendarAlt />
        </button>
      </div>
      
      {errorMessage && variant === 'error' && (
        <div className="error-message">{errorMessage}</div>
      )}
      
      {showCalendar && (
        <div className="calendar-container" ref={calendarRef}>
          <div className="calendar-header">
            <button 
              type="button" 
              className="month-nav" 
              onClick={goToPreviousMonth}
            >
              <FaChevronLeft />
            </button>
            
            <div className="month-selector-container">
              <select 
                value={viewDate.getMonth()} 
                onChange={handleMonthChange}
                className="month-selector"
              >
                {monthNames.map((month, index) => (
                  <option key={month} value={index}>{month}</option>
                ))}
              </select>
              
              <select 
                value={viewDate.getFullYear()} 
                onChange={handleYearChange}
                className="year-selector"
              >
                {getYearOptions().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <button 
              type="button" 
              className="month-nav" 
              onClick={goToNextMonth}
            >
              <FaChevronRight />
            </button>
          </div>
          
          <div className="calendar-week-header">
            {weekDays.map(day => (
              <div key={day} className="calendar-weekday">{day}</div>
            ))}
          </div>
          
          <div className="calendar-days">
            {generateCalendarDays().map((dayInfo, index) => (
              <div
                key={index}
                className={`calendar-day ${
                  dayInfo.isCurrentMonth ? 'current-month' : 'other-month'
                } ${
                  isDateSelected(dayInfo.day, dayInfo.month, dayInfo.year) ? 'selected' : ''
                } ${
                  isDateSelectable(dayInfo.day, dayInfo.month, dayInfo.year) ? '' : 'disabled'
                }`}
                onClick={() => 
                  isDateSelectable(dayInfo.day, dayInfo.month, dayInfo.year) && 
                  handleSelectDate(dayInfo.day, dayInfo.month, dayInfo.year)
                }
              >
                {dayInfo.day}
              </div>
            ))}
          </div>
          
          {showClearButton && (
            <div className="calendar-footer">
              <button 
                type="button" 
                className="clear-date-button"
                onClick={handleClearDate}
              >
                Limpar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

DatePicker.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  placeholder: PropTypes.string,
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  yearRange: PropTypes.number,
  showClearButton: PropTypes.bool,
  errorMessage: PropTypes.string,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'error', 'success'])
};

export default DatePicker;