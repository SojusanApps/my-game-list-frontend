import * as React from "react";
import { useState } from "react";
import { Box, Stack, SegmentedControl, Title, Container } from "@mantine/core";
import { PageMeta } from "@/components/ui/PageMeta";
import CalendarView from "../components/ReleaseCalendar/CalendarView";
import ListView from "../components/ReleaseCalendar/ListView";

export default function ReleaseCalendarPage(): React.JSX.Element {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  return (
    <>
      <PageMeta title="Release Calendar" />
      <Container size="xl" py="xl">
        <Stack gap={24}>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <Title order={1}>Release Calendar</Title>
            <SegmentedControl
              value={viewMode}
              onChange={val => setViewMode(val as "calendar" | "list")}
              data={[
                { label: "Calendar", value: "calendar" },
                { label: "List", value: "list" },
              ]}
              w={{ base: "100%", sm: "auto" }}
            />
          </Box>

          {viewMode === "calendar" ? <CalendarView /> : <ListView />}
        </Stack>
      </Container>
    </>
  );
}
