"use client";
import { useState } from "react";

export const useActionEvent = () => {
  const [actionEvent, setActionEvent] = useState({
    loading: false,
    error: "",
  });
  const { loading, error } = actionEvent;

  const startLoading = () => {
    setActionEvent({ ...actionEvent, loading: true });
  };

  const endLoading = () => {
    setActionEvent({ ...actionEvent, loading: false });
  };

  const onError = (errorMessage: string) => {
    setActionEvent({ ...actionEvent, error: errorMessage });
  };

  return { loading, error, startLoading, endLoading, onError };
};
