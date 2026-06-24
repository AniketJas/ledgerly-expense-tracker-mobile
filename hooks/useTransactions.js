// react custom hook file

import { useCallback, useState } from "react";
import { API_URL } from "../constants/api";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    type: "success",
    title: "",
    message: "",
  });

  // useCallback is used for performance reasons, it will memoize the function
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await response.json();
      console.log("Fetched transactions:", data.data);
      setTransactions(data.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      const data = await response.json();
      console.log("Fetched summary:", data.data);
      setSummary(data.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // can be run in parallel
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const hideFeedbackModal = useCallback(() => {
    setFeedbackModal((prev) => ({ ...prev, visible: false }));
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete transaction");

      await loadData();
      setFeedbackModal({
        visible: true,
        type: "success",
        title: "Transaction Deleted",
        message: "The transaction has been removed successfully.",
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setFeedbackModal({
        visible: true,
        type: "error",
        title: "Delete Failed",
        message: error.message || "We couldn't delete the transaction.",
      });
    }
  }, [loadData]);

  return {
    transactions,
    summary,
    isLoading,
    loadData,
    deleteTransaction,
    feedbackModal,
    hideFeedbackModal,
  };
};
