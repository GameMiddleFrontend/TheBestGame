import React, {FormEvent, PureComponent} from 'react';
import {FormProps, FormState} from './types';

class Form extends PureComponent<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props);
    this.state = {
      isValid: true,
    };
  }

  findValidators(result: Array<any> = [], children: Array<any>) {
    for (let i = 0; i < children.length; i++) {
      if (React.isValidElement(children[i])) {
        if (children[i].props.validator) {
          result.push(children[i]);
          continue;
        }
        if (children[i].props.children) {
          this.findValidators(result, children[i].props.children);
        }
      }
    }
  }

  validate(event: FormEvent<HTMLFormElement>) {
    const target = event.target as HTMLFormElement;
    const children = React.Children.toArray(this.props.children);
    const validators: Array<any> = [];
    this.findValidators(validators, children);
    let isValid = true;
    for (let i = 0; i < validators.length; i++) {
      isValid = !validators[i].props.validator.checkValid((target[validators[i].props.name] as HTMLInputElement).value);
      if (!isValid) {
        this.setState({isValid});
        console.log('submit failure ' + validators[i].props.name);
        break;
      }
    }
    if (this.props.onSubmit) {
      this.props.onSubmit(event);
    }
  }

  render() {
    const {formName, onSubmit, ...props} = this.props;
    return (
      <form onSubmit={(event) => this.validate(event)} {...props}>
        {formName ? <div className={'form-name'}>{formName}</div> : null}
        {this.props.children}
      </form>
    );
  }
}

export default Form;
