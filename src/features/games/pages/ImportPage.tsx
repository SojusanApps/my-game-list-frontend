import * as React from "react";
import { useTranslation } from "react-i18next";
import { useForm, schemaResolver } from "@mantine/form";
import { z } from "zod";
import { Link } from "@tanstack/react-router";
import { notifications } from "@mantine/notifications";
import {
  Box,
  Stack,
  Title,
  Text,
  Stepper,
  Select,
  TextInput,
  Group,
  Accordion,
  Badge,
  Divider,
  Textarea,
  NumberInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconDownload,
  IconCheck,
  IconInfoCircle,
  IconSearch,
  IconBrandSteam,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/Button";
import { PageMeta } from "@/components/ui/PageMeta";
import AsyncMultiSelectAutocomplete from "@/components/ui/Form/AsyncMultiSelectAutocomplete";
import { StatusEnum, GameSimpleList, SteamImportNotFound, GameListCreateWritable } from "@/client";
import {
  useSteamImport,
  useBulkCreateGameList,
  useGetGameMediasInfiniteQuery,
  useGetGameMediasByName,
} from "../hooks/gameQueries";
import { useGetUserDetails } from "@/features/users/hooks/userQueries";
import { useCurrentUserId } from "@/features/auth";
import code_to_value_mapping from "../utils/GameListStatuses";
import IGDBImageSize, { getIGDBImageURL } from "../utils/IGDBIntegration";
import { getRatingColor } from "@/utils/ratingUtils";
import { formatDate } from "@/utils/dateUtils";
import i18n from "@/lib/i18n";
import styles from "./ImportPage.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GameRow {
  game: GameSimpleList;
  status: StatusEnum;
  score: number | null;
  owned_on: string[];
  started_at: Date | null;
  completed_at: Date | null;
  playtime: number | null;
  description: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────

const steamFormSchema = z.object({
  source: z.string().min(1),
  steamProfileId: z.string().min(1, { message: i18n.t("validation:steamProfileIdRequired") }),
});
type SteamFormValues = z.infer<typeof steamFormSchema>;

// ─── Sub-components ───────────────────────────────────────────────────────────

interface GameRowItemProps {
  row: GameRow;
  index: number;
  onStatusChange: (index: number, value: StatusEnum) => void;
  onScoreChange: (index: number, value: number | null) => void;
  onFieldChange: (index: number, field: keyof GameRow, value: unknown) => void;
}

const GameRowItem = ({ row, index, onStatusChange, onScoreChange, onFieldChange }: GameRowItemProps) => {
  const { t } = useTranslation("games");
  const [expanded, setExpanded] = React.useState(false);
  const imageUrl = getIGDBImageURL(row.game.cover_image_id ?? "", IGDBImageSize.COVER_SMALL_90_128);

  return (
    <div className={styles.matchedRow}>
      <div className={styles.matchedRowMain}>
        {imageUrl ? (
          <img src={imageUrl} alt={row.game.title} className={styles.coverThumb} />
        ) : (
          <div className={styles.coverThumbPlaceholder}>
            <IconSearch size={18} color="var(--color-text-400)" />
          </div>
        )}
        <Text className={styles.gameTitle} title={row.game.title}>
          {row.game.title}
        </Text>
        <div className={styles.fieldGroup}>
          <Select
            size="xs"
            w={160}
            data={code_to_value_mapping().map(item => ({ value: item.code, label: item.value }))}
            value={row.status}
            onChange={val => onStatusChange(index, val ?? StatusEnum.PTP)}
            aria-label={t("import.status")}
          />
          <Select
            size="xs"
            w={80}
            clearable
            placeholder="—"
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => ({
              value: s.toString(),
              label: s.toString(),
            }))}
            renderOption={({ option }) => (
              <Box
                style={{
                  background: getRatingColor(Number(option.value)),
                  color: "black",
                  fontSize: "12px",
                  fontWeight: 900,
                  padding: "2px 8px",
                  borderRadius: "6px",
                  display: "inline-block",
                }}
              >
                {option.label}
              </Box>
            )}
            value={row.score === null ? null : row.score.toString()}
            onChange={val => onScoreChange(index, val ? Number(val) : null)}
            aria-label={t("import.score")}
          />
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setExpanded(v => !v)}
            aria-label={expanded ? t("import.collapseRow") : t("import.expandRow")}
            rightSection={expanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
          >
            {t("import.moreDetails")}
          </Button>
        </div>
      </div>

      <div className={styles.expandedFields} style={{ display: expanded ? "flex" : "none" }}>
        <AsyncMultiSelectAutocomplete
          id={`owned-on-${index}`}
          name={`owned_on_${index}`}
          label={t("modal.ownedOnLabel")}
          placeholder={t("modal.ownedOnPlaceholder")}
          useInfiniteQueryHook={useGetGameMediasInfiniteQuery}
          getOptionLabel={item => item.name}
          getOptionValue={item => item.id.toString()}
          value={row.owned_on}
          onChange={val => onFieldChange(index, "owned_on", val)}
        />
        <Group grow align="flex-start">
          <DateInput
            size="xs"
            label={t("modal.startedAt")}
            placeholder={t("modal.pickDate")}
            clearable
            valueFormat="YYYY-MM-DD"
            value={row.started_at}
            onChange={val => onFieldChange(index, "started_at", val)}
          />
          <DateInput
            size="xs"
            label={t("modal.completedAt")}
            placeholder={t("modal.pickDate")}
            clearable
            valueFormat="YYYY-MM-DD"
            value={row.completed_at}
            onChange={val => onFieldChange(index, "completed_at", val)}
          />
          <NumberInput
            size="xs"
            label={t("modal.playtime")}
            placeholder="0"
            min={0}
            allowNegative={false}
            value={row.playtime ?? ""}
            onChange={val => onFieldChange(index, "playtime", val === "" ? null : Number(val))}
          />
        </Group>
        <Textarea
          size="xs"
          label={t("modal.noteLabel")}
          placeholder={t("modal.notePlaceholder")}
          maxLength={200}
          rows={2}
          value={row.description}
          onChange={e => onFieldChange(index, "description", e.currentTarget.value)}
        />
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ImportPage(): React.JSX.Element {
  const { t } = useTranslation("games");
  const currentUserId = useCurrentUserId();
  const { data: userDetails } = useGetUserDetails(currentUserId || undefined);
  const userSlug = userDetails?.slug || currentUserId?.toString() || "";

  const [activeStep, setActiveStep] = React.useState(0);
  const [gameRows, setGameRows] = React.useState<GameRow[]>([]);
  const [notFound, setNotFound] = React.useState<SteamImportNotFound[]>([]);
  const [totalImported, setTotalImported] = React.useState(0);
  const [importedCount, setImportedCount] = React.useState(0);

  const { mutateAsync: runSteamImport, isPending: isFetching } = useSteamImport();
  const { mutateAsync: runBulkCreate, isPending: isImporting } = useBulkCreateGameList();

  // Fetch Steam media ID to pre-fill owned_on for all Steam imports
  const { data: steamMediaData } = useGetGameMediasByName("Steam");
  const steamMediaId = steamMediaData?.results.find(m => m.name.toLowerCase() === "steam")?.id;

  const form = useForm<SteamFormValues>({
    initialValues: { source: "steam", steamProfileId: "" },
    validate: schemaResolver(steamFormSchema),
  });

  // ── Step 1: Fetch from Steam ─────────────────────────────────────────────
  const handleFetch = async (values: SteamFormValues) => {
    try {
      const result = await runSteamImport(values.steamProfileId);
      setTotalImported(result.total_imported);
      setNotFound(result.not_found);
      setGameRows(
        result.matched.map(game => ({
          game,
          status: StatusEnum.PTP,
          score: null,
          owned_on: steamMediaId ? [steamMediaId.toString()] : [],
          started_at: null,
          completed_at: null,
          playtime: null,
          description: "",
        })),
      );
      setActiveStep(1);
    } catch {
      // error is handled by useAppMutation (shows a toast automatically)
    }
  };

  // ── Step 2: Bulk import ─────────────────────────────────────────────────
  const handleImport = async () => {
    if (!currentUserId) {
      notifications.show({ title: "Error", message: "User not identified.", color: "red" });
      return;
    }
    const body: GameListCreateWritable[] = gameRows.map(row => ({
      game: row.game.id,
      user: currentUserId,
      status: row.status,
      score: row.score,
      owned_on: row.owned_on.map(Number),
      started_at: formatDate(row.started_at, "YYYY-MM-DD"),
      completed_at: formatDate(row.completed_at, "YYYY-MM-DD"),
      playtime: row.playtime,
      description: row.description || undefined,
    }));
    try {
      await runBulkCreate(body);
      setImportedCount(gameRows.length);
      setActiveStep(2);
    } catch {
      // handled by useAppMutation
    }
  };

  // ── Row update helpers ──────────────────────────────────────────────────
  const handleStatusChange = React.useCallback((index: number, value: StatusEnum) => {
    setGameRows(prev => {
      const next = [...prev];
      next[index] = { ...next[index], status: value };
      return next;
    });
  }, []);

  const handleScoreChange = React.useCallback((index: number, value: number | null) => {
    setGameRows(prev => {
      const next = [...prev];
      next[index] = { ...next[index], score: value };
      return next;
    });
  }, []);

  const handleFieldChange = React.useCallback((index: number, field: keyof GameRow, value: unknown) => {
    setGameRows(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  return (
    <Box py={48} style={{ minHeight: "100vh" }}>
      <PageMeta title={t("import.title")} />
      <Stack gap={40} maw={960} mx="auto" px={16}>
        {/* Header */}
        <Stack align="center" gap={8}>
          <Title order={1} fz={{ base: 28, md: 36 }} fw={800} c="var(--color-text-900)" ta="center">
            {t("import.title")}
          </Title>
          <Text c="dimmed" ta="center">
            {t("import.selectSource")}
          </Text>
        </Stack>

        {/* Stepper */}
        <Stepper active={activeStep} className={styles.stepperWrapper}>
          <Stepper.Step label={t("import.stepConnect")} completedIcon={<IconCheck size={16} />} />
          <Stepper.Step label={t("import.stepConfigure")} completedIcon={<IconCheck size={16} />} />
          <Stepper.Step label={t("import.stepDone")} completedIcon={<IconCheck size={16} />} />
        </Stepper>

        {/* ── Step 0: Connect ─────────────────────────────── */}
        {activeStep === 0 && (
          <Box className={styles.card}>
            <form onSubmit={form.onSubmit(handleFetch)} noValidate>
              <Stack gap={24}>
                <Select
                  id="import-source"
                  label={t("import.selectSource")}
                  data={[{ value: "steam", label: "Steam" }]}
                  value="steam"
                  readOnly
                  leftSection={form.values.source === "steam" ? <IconBrandSteam size={16} /> : undefined}
                  leftSectionPointerEvents="none"
                  renderOption={({ option }) => (
                    <Group gap={8}>
                      {option.value === "steam" && <IconBrandSteam size={16} />}
                      <span>{option.label}</span>
                    </Group>
                  )}
                  {...form.getInputProps("source")}
                />

                <TextInput
                  id="steam-profile-id"
                  label={t("import.steamIdLabel")}
                  placeholder={t("import.steamIdPlaceholder")}
                  {...form.getInputProps("steamProfileId")}
                />

                {/* Notice */}
                <div className={styles.noticeBox}>
                  <IconInfoCircle size={20} style={{ color: "var(--mantine-color-primary-6)", flexShrink: 0 }} />
                  <Text fz="sm" c="var(--color-text-700)">
                    {t("import.steamNotice")}
                  </Text>
                </div>

                <Group justify="flex-end">
                  <Button type="submit" isLoading={isFetching} leftSection={<IconDownload size={16} />}>
                    {t("import.fetchButton")}
                  </Button>
                </Group>
              </Stack>
            </form>
          </Box>
        )}

        {/* ── Step 1: Configure ───────────────────────────── */}
        {activeStep === 1 && (
          <Stack gap={24}>
            {/* Stats box */}
            <div className={styles.statsBox}>
              <Text className={styles.statNumber}>{totalImported}</Text>
              <Stack gap={2}>
                <Text fw={600} c="var(--color-text-900)">
                  {t("import.totalImported", { count: totalImported })}
                </Text>
              </Stack>
            </div>

            {/* Matched games */}
            <Box className={styles.card}>
              <Stack gap={16}>
                <Group justify="space-between" align="center">
                  <Title order={3} fz={20} fw={700} c="var(--color-text-900)">
                    {t("import.matchedTitle")}
                  </Title>
                  <Text fz="sm" c="dimmed">
                    {t("import.matchedDescription")}
                  </Text>
                  <Badge variant="light" color="teal" size="lg">
                    {gameRows.length}
                  </Badge>
                </Group>

                <Group fz="sm" fw={600} c="dimmed" gap={16} style={{ paddingLeft: 64 }}>
                  <Text style={{ flex: 1 }}>{t("import.gameTitle")}</Text>
                  <Text w={160}>{t("import.status")}</Text>
                  <Text w={80}>{t("import.score")}</Text>
                  <Text w={100}></Text>
                </Group>
                <Divider />

                {gameRows.length === 0 ? (
                  <Text ta="center" c="dimmed" py={24}>
                    {t("import.noMatched")}
                  </Text>
                ) : (
                  <div className={styles.scrollList}>
                    {gameRows.map((row, i) => (
                      <GameRowItem
                        key={row.game.id}
                        row={row}
                        index={i}
                        onStatusChange={handleStatusChange}
                        onScoreChange={handleScoreChange}
                        onFieldChange={handleFieldChange}
                      />
                    ))}
                  </div>
                )}
              </Stack>
            </Box>

            {/* Not found accordion */}
            {notFound.length > 0 && (
              <Accordion variant="separated" radius="md">
                <Accordion.Item value="not-found">
                  <Accordion.Control icon="⚠️">
                    <Group gap={8}>
                      <Text fw={600}>{t("import.notFoundTitle")}</Text>
                      <Badge variant="light" color="orange" size="sm">
                        {notFound.length}
                      </Badge>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap={8}>
                      <Text fz="sm" c="dimmed" mb={8}>
                        {t("import.notFoundDescription")}
                      </Text>
                      {notFound.map(item => (
                        <div key={item.appid} className={styles.notFoundItem}>
                          <Text fz="sm" c="var(--color-text-700)">
                            {item.name}
                          </Text>
                          <Text fz="xs" c="dimmed" ml="auto">
                            AppID: {item.appid}
                          </Text>
                        </div>
                      ))}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            )}

            <Group justify="space-between">
              <Button variant="outline" onClick={() => setActiveStep(0)}>
                ← {t("import.stepConnect")}
              </Button>
              <Button
                onClick={handleImport}
                isLoading={isImporting}
                disabled={gameRows.length === 0}
                leftSection={<IconDownload size={16} />}
              >
                {t("import.importButton", { count: gameRows.length })}
              </Button>
            </Group>
          </Stack>
        )}

        {/* ── Step 2: Success ─────────────────────────────── */}
        {activeStep === 2 && (
          <Box className={styles.card}>
            <Stack align="center" gap={24} className={styles.successCard}>
              <div className={styles.successIcon}>🏆</div>
              <Title order={2} fw={800} c="var(--color-text-900)">
                {t("import.successTitle")}
              </Title>
              <Text ta="center" c="dimmed" fz="lg">
                {t("import.successMessage", { count: importedCount })}
              </Text>
              {currentUserId && userSlug && (
                <Link to="/game-list/$id/$slug" params={{ id: currentUserId.toString(), slug: userSlug }}>
                  <Button leftSection={<IconCheck size={16} />}>{t("import.backButton")}</Button>
                </Link>
              )}
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
