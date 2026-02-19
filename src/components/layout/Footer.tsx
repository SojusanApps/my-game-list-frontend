import * as React from "react";
import { Link } from "react-router-dom";
import { Box, Group, Text } from "@mantine/core";
import AppLogo from "@/components/ui/AppLogo";
import styles from "./Footer.module.css";

const Footer = (): React.JSX.Element => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      style={{
        background: "white",
        borderTop: "1px solid var(--color-background-400)",
        paddingBlock: "24px",
        marginTop: "auto",
      }}
    >
      <Group justify="space-between" wrap="wrap" align="center" maw={1280} mx="auto" px={16}>
        <Group gap={24}>
          <Link to="/home" className={styles.logoLink} style={{ transform: "scale(0.75)", transformOrigin: "left" }}>
            <AppLogo size="md" />
          </Link>
          <Text size="xs" c="var(--color-text-400)" visibleFrom="sm">
            © {currentYear} Sojusan GameList • Data provided by{" "}
            <a href="https://www.igdb.com/" target="_blank" rel="noopener noreferrer" className={styles.footerExtLink}>
              IGDB
            </a>
          </Text>
        </Group>

        <Box component="nav">
          <Group component="ul" gap={32}>
            <Box component="li">
              <Link to="/home" className={styles.footerLink}>
                Home
              </Link>
            </Box>
            <Box component="li">
              <Link to="/search" className={styles.footerLink}>
                Search
              </Link>
            </Box>
            <Box component="li">
              <Link to="#" className={styles.footerLink}>
                Privacy
              </Link>
            </Box>
          </Group>
        </Box>
      </Group>
    </Box>
  );
};

export default Footer;
