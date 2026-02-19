import * as React from "react";
import { jwtDecode } from "jwt-decode";

import { Link } from "react-router-dom";
import AppLogo from "@/components/ui/AppLogo";
import { Button } from "@/components/ui/Button";
import { TokenInfoType, LocalStorageUserType } from "@/types";
import SearchBar from "@/features/games/components/SearchBar";

import NotificationBell from "@/features/notifications/components/NotificationBell";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { IconChevronDown, IconUserCircle, IconSettings, IconLogout } from "@tabler/icons-react";
import { Box, Group, Menu, Text, UnstyledButton } from "@mantine/core";
import styles from "./TopBar.module.css";

import { useGetUserDetails } from "@/features/users/hooks/userQueries";
import { SafeImage } from "@/components/ui/SafeImage";

function LoggedInView({
  user,
  logout,
}: Readonly<{ user: LocalStorageUserType | null; logout: () => void }>): React.JSX.Element {
  const userInfo = jwtDecode<TokenInfoType>(user!.token);
  const { data: userDetails } = useGetUserDetails(userInfo.user_id);

  const handleClick = () => {
    logout();
    globalThis.location.reload();
  };

  return (
    <Group gap={16}>
      <NotificationBell />
      <Menu shadow="xl" width={220} position="bottom-end" withArrow>
        <Menu.Target>
          <UnstyledButton className={styles.userMenuBtn}>
            <Text component="span" fz="sm" fw={500} c="var(--color-primary-100)" visibleFrom="md">
              {userDetails?.username}
            </Text>
            <SafeImage
              src={userDetails?.gravatar_url || undefined}
              alt="User avatar"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "9999px",
                outline: "2px solid rgba(255,255,255,0.2)",
                flexShrink: 0,
              }}
            />
            <IconChevronDown size={16} style={{ color: "var(--color-primary-300)" }} />
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item component={Link} to={`/profile/${userInfo?.user_id}`} leftSection={<IconUserCircle size={16} />}>
            Profile
          </Menu.Item>
          <Menu.Item component={Link} to="/settings" leftSection={<IconSettings size={16} />}>
            Account settings
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item color="red" onClick={handleClick} leftSection={<IconLogout size={16} />}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}

function NotLoggedInView(): React.JSX.Element {
  return (
    <Group gap={12}>
      <Link to="/register">
        <Button variant="ghost" size="sm">
          Register
        </Button>
      </Link>
      <Link to="/login">
        <Button size="sm">Login</Button>
      </Link>
    </Group>
  );
}

function TopBar(): React.JSX.Element {
  const { user, logout } = useAuth();

  let userInfo: TokenInfoType | null = null;

  if (user) {
    userInfo = jwtDecode<TokenInfoType>(user.token);
  }

  return (
    <Box
      component="nav"
      pos="sticky"
      style={{
        top: 0,
        zIndex: 50,
        width: "100%",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        background: "var(--color-primary-950)",
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
      }}
    >
      <Group justify="space-between" align="center" maw={1280} mx="auto" p={12}>
        <Group gap={32}>
          <Link to="/home" className={styles.logoLink} aria-label="Game List logo">
            <AppLogo size="md" onDark />
          </Link>

          <Group component="ul" gap={32} visibleFrom="lg">
            <Box component="li" className={styles.navItem}>
              <Link to="/search" className={styles.navLink}>
                Search Engine
              </Link>
            </Box>

            {user && (
              <>
                <Box component="li" className={styles.navItem}>
                  <Link to={`/game-list/${userInfo?.user_id}`} className={styles.navLink}>
                    Game List
                  </Link>
                </Box>
                <Box component="li" className={styles.navItem}>
                  <Link to={`/profile/${userInfo?.user_id}/collections`} className={styles.navLink}>
                    Collections
                  </Link>
                </Box>
              </>
            )}
          </Group>
        </Group>

        <Box visibleFrom="md" style={{ flex: 1, maxWidth: "448px", marginInline: "16px" }}>
          <SearchBar />
        </Box>

        <Group gap={16}>{user ? <LoggedInView user={user} logout={logout} /> : <NotLoggedInView />}</Group>
      </Group>
    </Box>
  );
}

export default TopBar;
