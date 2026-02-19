import * as React from "react";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod";

import { TextInput, Box, Group, Stack } from "@mantine/core";
import { Button } from "@/components/ui/Button";

const validationSchema = z.object({
  name: z.string().optional(),
});

export type ValidationSchema = z.infer<typeof validationSchema>;

function CompanySearchFilter({
  onSubmitHandlerCallback,
}: Readonly<{ onSubmitHandlerCallback: (data: ValidationSchema) => void }>) {
  const form = useForm<ValidationSchema>({
    initialValues: {
      name: "",
    },
    validate: zod4Resolver(validationSchema),
  });

  return (
    <Box
      component="form"
      onSubmit={form.onSubmit(onSubmitHandlerCallback)}
      noValidate
      style={{ display: "flex", flexDirection: "column", gap: "32px" }}
    >
      <Box style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px 32px" }}>
        <Stack gap={16}>
          <TextInput
            id="name"
            name="name"
            label="Company Name"
            placeholder="Search by name..."
            {...form.getInputProps("name")}
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

export default CompanySearchFilter;
