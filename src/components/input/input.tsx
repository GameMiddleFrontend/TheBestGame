import React, {ChangeEventHandler, PureComponent} from 'react';
import {InputProps, InputState} from './types';

import './styles.scss';

class Input extends PureComponent<InputProps, InputState> {
  constructor(props: InputProps) {
    super(props);
    this.state = {
      shouldShowLabel: this.showLabel(),
      validationMessage: this.validate(this.props.value as string),
    };
  }

  public validate(value: string): string | undefined {
    if (!this.props.validator) {
      return;
    }
    return this.props.validator.checkValid(value);
  }

  showLabel(value?: string): boolean {
    if (this.props.neverShowLabel) {
      return false;
    }
    if (this.props.alwaysShowLabel) {
      return true;
    }
    return !!value;
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const target = event.target;
    const shouldShowLabel = this.showLabel(target.value);
    const validationMessage = this.validate(target.value);
    this.setState({shouldShowLabel, validationMessage});
    if (this.props.onValidate) {
      this.props.onValidate(this.props.name, this.state.validationMessage);
    }
  }

  render() {
    const {
      containerProps,
      labelProps,
      validationProps,
      alwaysShowLabel,
      neverShowLabel,
      validator,
      onValidate,
      ...inputProps
    } = this.props;
    return (
      <div {...containerProps}>
        {this.state.shouldShowLabel ? <div {...labelProps}>{this.props.placeholder}</div> : null}
        <input {...inputProps} onChange={(event) => this.onChange(event)} />
        {this.state.validationMessage ? <div {...validationProps}>{this.state.validationMessage}</div> : null}
      </div>
    );
  }
}

export default Input;
