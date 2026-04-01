"use client";

import { useState } from "react";

export function useFormFeedback() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function startLoading() {
    setLoading(true);
    setError("");
    setSuccess("");
  }

  function stopLoading() {
    setLoading(false);
  }

  function showError(message) {
    setError(message || "Erro inesperado");
  }

  function showSuccess(message) {
    setSuccess(message || "Sucesso");
  }

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  return {
    loading,
    error,
    success,
    startLoading,
    stopLoading,
    showError,
    showSuccess,
    clearMessages,
  };
}
