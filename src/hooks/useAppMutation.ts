import { useMutation, UseMutationOptions, DefaultError } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

/**
 * Custom wrapper around useMutation that provides consistent error handling
 * by automatically showing a notification on failure.
 */
export function useAppMutation<TData = unknown, TError = DefaultError, TVariables = void, TContext = unknown>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
) {
  return useMutation({
    ...options,
    onError: (...args) => {
      const [error] = args;
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      notifications.show({ title: "Error", message, color: "red" });

      if (options.onError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (options.onError as any)(...args);
      }
    },
  });
}
