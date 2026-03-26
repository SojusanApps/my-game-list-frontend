import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Box, Center, Paper, Stack, Text, Title } from "@mantine/core";
import { PageMeta } from "@/components/ui/PageMeta";
import { Button } from "@/components/ui/Button";

export default function NotFound(): React.JSX.Element {
  return (
    <Center style={{ minHeight: "70vh" }}>
      <PageMeta title="404 - Not Found" />

      <Paper p="xl" radius="md" style={{ textAlign: "center", maxWidth: 500 }} w="100%">
        <Stack align="center" gap="md">
          <Text fw={900} c="var(--color-primary-600)" style={{ fontSize: "6rem", lineHeight: 1 }}>
            404
          </Text>
          <Title order={1} c="var(--color-text-900)">
            Oops! Page Not Found
          </Title>
          <Text size="lg" c="var(--color-text-600)">
            Lost in the adventure? No worries! Let&apos;s head back home together and continue your quest.
          </Text>
          <Box mt="md">
            <Link to="/home">
              <Button size="lg">Go Back Home</Button>
            </Link>
          </Box>
        </Stack>
      </Paper>
    </Center>
  );
}
