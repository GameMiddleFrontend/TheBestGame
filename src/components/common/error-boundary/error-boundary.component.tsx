import React, {Component, PropsWithChildren, ComponentType} from 'react';
import {ErrorBoundaryState, FallbackProps} from './types';

interface IProps {
  FallbackComponent: ComponentType<FallbackProps>;
}

class ErrorBoundaryComponent extends Component<PropsWithChildren<IProps>, ErrorBoundaryState> {
  static initialState: ErrorBoundaryState = {error: null};

  static getDerivedStateFromError(error: Error) {
    // Обновить состояние с тем, чтобы следующий рендер показал запасной UI.
    return {error};
  }

  state = ErrorBoundaryComponent.initialState;

  render() {
    const {error} = this.state;
    const {FallbackComponent} = this.props;

    return error ? <FallbackComponent error={error} /> : this.props.children;
  }
}

export default ErrorBoundaryComponent;
