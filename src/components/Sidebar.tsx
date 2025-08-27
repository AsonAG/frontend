import React, { PropsWithChildren, ReactNode } from "react";
import { IconButton, Portal } from "@mui/material";
import { ContentLayout } from "./ContentLayout";
import { Close } from "@mui/icons-material";

type SidebarProps = PropsWithChildren & {
	title: string;
	closeButton?: ReactNode | undefined;
	onClose?: () => void | undefined;
};

export function Sidebar({
	title,
	closeButton,
	onClose,
	children,
}: SidebarProps) {
	let button = closeButton;
	if (!button) {
		button = <ButtonClose onClose={onClose} />;
	}
	return (
		<Portal container={document.getElementById("sidebar-container")}>
			<ContentLayout title={title} buttons={button}>
				{children}
			</ContentLayout>
		</Portal>
	);
}

function ButtonClose({ onClose }) {
	return (
		<IconButton onClick={onClose} size="small">
			<Close />
		</IconButton>
	);
}
