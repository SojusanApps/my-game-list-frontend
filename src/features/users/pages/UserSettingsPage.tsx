import * as React from "react";
import { useTranslation } from "react-i18next";
import { Box, Title } from "@mantine/core";
import { PageMeta } from "@/components/ui/PageMeta";

export default function UserProfilePage(): React.JSX.Element {
  const { t } = useTranslation("users");
  return (
    <Box>
      <PageMeta title={t("settings.title")} />
      <Title order={2} className="text-center text-9xl font-bold">
        {t("settings.title")}
      </Title>
    </Box>
  );
}
