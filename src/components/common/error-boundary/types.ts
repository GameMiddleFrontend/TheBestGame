export type ErrorBoundaryState = {error: Error | null};

export type FallbackProps = {
  error?: Error;
  customMessageHeader?: string;
  customMessage?: string;
};
