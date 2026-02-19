import * as React from "react";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod";

import { Box, Group, Stack, TextInput } from "@mantine/core";
import { Button } from "@/components/ui/Button";

const validationSchema = z.object({
  username: z.string().optional(),
});

export type ValidationSchema = z.infer<typeof validationSchema>;

function UserSearchFilter({
  onSubmitHandlerCallback,
}: Readonly<{ onSubmitHandlerCallback: (data: ValidationSchema) => void }>) {
  const form = useForm<ValidationSchema>({
    initialValues: {
      username: "",
    },
    validate: zod4Resolver(validationSchema),
  });

  return (
    <Box
      component="form"
      style={{ display: "flex", flexDirection: "column", gap: "32px" }}
      onSubmit={form.onSubmit(onSubmitHandlerCallback)}
      noValidate
    >
      <Box style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px 32px" }}>
        <Stack gap={16}>
          <TextInput
            id="username"
            name="username"
            label="Username"
            placeholder="Search by username..."
            {...form.getInputProps("username")}
          />
        </Stack>
      </Box>

      <Group justify="center" pt={16} style={{ borderTop: "1px solid var(--color-background-100)" }}>
        <Button
          type="submit"
          size="lg"
          style={{ width: "100%", maxWidth: "256px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
        >
          Apply Filters
        </Button>
      </Group>
    </Box>
  );
}

export default UserSearchFilter;
