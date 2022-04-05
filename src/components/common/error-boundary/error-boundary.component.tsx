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

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Можно также сохранить информацию об ошибке в соответствующую службу журнала ошибок
  }

  render() {
    const {error} = this.state;
    const {FallbackComponent} = this.props;

    if (error !== null) {
      const props = {
        error,
      };
      return <FallbackComponent {...props} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundaryComponent;
