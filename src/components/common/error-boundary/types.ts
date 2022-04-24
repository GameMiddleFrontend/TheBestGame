export type ErrorBoundaryState = {error: Error | null};

export interface FallbackProps {
  error?: Error;
  customMessageHeader?: string;
  customMessage?: string;
}
