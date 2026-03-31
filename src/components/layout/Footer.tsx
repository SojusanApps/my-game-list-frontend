import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Box, Text } from "@mantine/core";
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
      <div className={styles.footerInner}>
        <div className={styles.leftSection}>
          <Link to="/home" className={styles.logoLink}>
            <AppLogo size="md" />
          </Link>
          <Text size="xs" c="var(--color-text-400)">
            © {currentYear} Sojusan GameList • Data provided by{" "}
            <a href="https://www.igdb.com/" target="_blank" rel="noopener noreferrer" className={styles.footerExtLink}>
              IGDB
            </a>
          </Text>
        </div>

        <nav>
          <ul className={styles.navGroup}>
            <li>
              <Link to="/home" className={styles.footerLink}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/search" className={styles.footerLink}>
                Search
              </Link>
            </li>
            <li>
              <Link to="/home" className={styles.footerLink}>
                Privacy
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </Box>
  );
};

export default Footer;
