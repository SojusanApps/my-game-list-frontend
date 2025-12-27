import { useMutation, UseMutationOptions, DefaultError } from "@tanstack/react-query";
import toast from "react-hot-toast";

/**
 * Custom wrapper around useMutation that provides consistent error handling
 * by automatically showing a toast message on failure.
 */
export function useAppMutation<TData = unknown, TError = DefaultError, TVariables = void, TContext = unknown>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
) {
  return useMutation({
    ...options,
    onError: (...args) => {
      const [error] = args;
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(message);

      if (options.onError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (options.onError as any)(...args);
      }
    },
  });
}
