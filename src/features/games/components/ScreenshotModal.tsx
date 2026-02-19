import * as React from "react";
import IGDBImageSize, { getIGDBImageURL } from "../utils/IGDBIntegration";
import { IconX } from "@tabler/icons-react";
import { Box, Loader, Modal, UnstyledButton } from "@mantine/core";

interface ScreenshotModalProps {
  screenshot: string;
  onClose: () => void;
}

export default function ScreenshotModal({ screenshot, onClose }: Readonly<ScreenshotModalProps>) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <Modal
      opened={true}
      onClose={onClose}
      withCloseButton={false}
      padding={0}
      size="auto"
      radius="md"
      overlayProps={{ backgroundOpacity: 0.9 }}
      styles={{
        content: { background: "transparent", boxShadow: "none", overflow: "visible" },
        body: { background: "transparent", overflow: "visible" },
      }}
    >
      {/* Close button — fixed to viewport top-right, perfect circle */}
      <UnstyledButton
        onClick={onClose}
        aria-label="Close screenshot"
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: "rgba(0,0,0,0.6)",
          border: "1.5px solid rgba(255,255,255,0.25)",
          borderRadius: "50%",
          color: "white",
          zIndex: 9999,
          cursor: "pointer",
          backdropFilter: "blur(4px)",
        }}
      >
        <IconX size={20} stroke={2.5} />
      </UnstyledButton>

      <Box
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Spinner shown while image loads — sized so no scrollbars appear */}
        {!isLoaded && (
          <Box
            style={{
              width: 640,
              height: 360,
              maxWidth: "90vw",
              maxHeight: "70vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Loader color="white" size="lg" />
          </Box>
        )}

        <img
          src={getIGDBImageURL(screenshot, IGDBImageSize.SCREENSHOT_HUGE_1280_720)}
          alt="Enlarged screenshot"
          onLoad={() => setIsLoaded(true)}
          style={{
            display: isLoaded ? "block" : "none",
            maxWidth: "90vw",
            maxHeight: "85vh",
            objectFit: "contain",
            borderRadius: 8,
            boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
          }}
        />
      </Box>
    </Modal>
  );
}
