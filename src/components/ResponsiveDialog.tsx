import React from "react";
import { Drawer } from "vaul";
import * as Dialog from "@radix-ui/react-dialog";
import { Box, Stack, Typography, styled } from "@mui/material";
import { useIsMobile } from "../hooks/useIsMobile";

const DrawerContent = styled('div')(({theme}) =>
  theme.unstable_sx({
    position: "fixed",
    borderTopLeftRadius: theme.shape.borderRadius * 4,
    borderTopRightRadius: theme.shape.borderRadius * 4,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.palette.background.default,
    mt: 10,
    padding: 2,
    zIndex: 10000,
    minHeight: "33vh",
    ":focus-visible": {
      outline: "none"
    }
  })
);

const DialogContent = styled('div')(({theme}) =>
  theme.unstable_sx({
    position: "fixed",
    borderRadius: 1,
    backgroundColor: theme.palette.background.default,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90vw",
    maxWidth: 600,
    maxHeight: "85vh",
    padding: 3,
    zIndex: 10000,
    ":focus-visible": {
      outline: "none"
    },
    boxShadow: theme.shadows[1]
  })
);

export function ResponsiveDialog({title, trigger, children}) {
  const isMobile = useIsMobile();
  const Component = isMobile ? Drawer : Dialog;
  const Content = isMobile ? DrawerContent : DialogContent;
  return (
    <Component.Root preventScrollRestoration={false}>
      <Component.Trigger asChild>
        {trigger}
      </Component.Trigger>
      <Component.Portal>
        <Component.Overlay style={{position: "fixed", inset: 0, backgroundColor: "rgb(0 0 0 / 0.4)", zIndex: 9999}} />
        <Component.Content asChild>
          <Content>
            <Stack spacing={2}>
              {isMobile && <Box sx={{bgcolor: "divider", borderRadius: 1, alignSelf: "center", height: 6, width: "3rem"}} />}
              <Component.Title asChild>
                <Typography variant="h6">{title}</Typography>
              </Component.Title>
              {children}
            </Stack>
          </Content>
        </Component.Content>
      </Component.Portal>
    </Component.Root>
  );
  
}
