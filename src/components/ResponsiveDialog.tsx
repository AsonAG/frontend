import React from "react";
import { Drawer } from "vaul";
import * as Dialog from "@radix-ui/react-dialog";
import { Box, Stack, Typography, styled } from "@mui/material";
import { useIsMobile } from "../hooks/useIsMobile";
import { ReactNode } from "react";

const DrawerContent = styled('div', {
  shouldForwardProp: () => true
})(({theme}) =>
  theme.unstable_sx({
    position: "fixed",
    borderTopLeftRadius: theme.shape.borderRadius * 4,
    borderTopRightRadius: theme.shape.borderRadius * 4,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.palette.background.default,
    mt: "var(--header-height)",
    padding: 2,
    zIndex: theme.zIndex.modal,
    minHeight: "33vh",
    ":focus-visible": {
      outline: "none"
    }
  })
);

const DialogContent = styled('div', {
  shouldForwardProp: () => true
})(({theme}) =>
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
    zIndex: theme.zIndex.modal,
    ":focus-visible": {
      outline: "none"
    },
    boxShadow: theme.shadows[1]
  })
);

interface Props {
  children?: ReactNode;
}

export const ResponsiveDialogContent = React.forwardRef<HTMLDivElement, Props>(
  ({children, ...props}, forwardedRef) => {
    const isMobile = useIsMobile();
    const Component = isMobile ? Drawer : Dialog;
    const Content = isMobile ? DrawerContent : DialogContent;
    return (
      <Component.Portal>
        <Component.Overlay style={{position: "fixed", inset: 0, backgroundColor: "rgb(0 0 0 / 0.4)", zIndex: 1200}} />
        <Component.Content asChild {...props} ref={forwardedRef}>
          <Content>
            <Stack spacing={2}>
              {isMobile && <Box sx={{bgcolor: "divider", borderRadius: 1, alignSelf: "center", height: 6, width: "3rem"}} />}
              {children}
            </Stack>
          </Content>
        </Component.Content>
      </Component.Portal>
    );
  }
);

export const ResponsiveDialogTrigger = React.forwardRef<HTMLButtonElement, Props>(
  ({children}, forwardedRef) => {
    const isMobile = useIsMobile();
    const Component = isMobile ? Drawer : Dialog;
    return (
      <Component.Trigger asChild ref={forwardedRef}>
        {children}
      </Component.Trigger>
    )
  }
);

export const ResponsiveDialogClose = React.forwardRef<HTMLButtonElement, Props>(
  ({children}, forwardedRef) => {
    const isMobile = useIsMobile();
    const Component = isMobile ? Drawer : Dialog;
    return (
      <Component.Close asChild ref={forwardedRef}>
        {children}
      </Component.Close>
    )
  }
);

export function ResponsiveDialog(args: any, context: any) {
  const isMobile = useIsMobile();
  const Component = isMobile ? Drawer : Dialog;
  return Component.Root(args, context);
}
