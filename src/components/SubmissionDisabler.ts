import React, { PropsWithChildren } from "react";
import { useNavigation } from "react-router-dom";

export const SubmissionDisabler = React.forwardRef<any, PropsWithChildren>(({ children, ...props }, ref) => {
  const navigation = useNavigation();

  if (!React.isValidElement(children)) {
    return null;
  }
  const submitting = navigation.state === "submitting";
  const content = React.cloneElement(children, {
    ref,
    ...children.props,
    ...props,
    disabled: !!children.props?.disabled || submitting,
    loading: submitting
  });

  return content;
})
