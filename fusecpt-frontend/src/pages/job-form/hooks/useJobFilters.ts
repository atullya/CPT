import { useState, useCallback, useEffect } from "react";
import type { JobQueryParams } from "@/store/jobs/jobsTypes";

export type ViewMode = "grid" | "list";
export type SortField =
  | "jobTitle"
  | "clientName"
  | "contractType"
  | "status"
  | "totalCandidates"
  | "activeCandidates"
  | "createdAt"
  | "updatedAt";

export interface TableSort {
  field: SortField;
  direction: "asc" | "desc";
}

export const useJobFilters = () => {
  const getInitialTab = (): "open" | "on-hold" | "closed-won" | "closed-lost" => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam === "on-hold" || tabParam === "closed-won" || tabParam === "closed-lost") {
      return tabParam;
    }
    return "open";
  };

  const getInitialPage = (): number => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get("page");
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      return !isNaN(page) && page > 0 ? page : 1;
    }
    return 1;
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<
    "open" | "on-hold" | "closed-won" | "closed-lost"
  >(getInitialTab());
  const [view, setView] = useState<ViewMode>("list");
  const [tableSort, setTableSort] = useState<TableSort>({
    field: "updatedAt",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(getInitialPage());
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", activeTab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [activeTab]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", currentPage.toString());
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [currentPage]);

  const handleTableSort = useCallback((field: SortField) => {
    setTableSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const updateSearchTerm = useCallback((term: string) => {
    if (term === searchTerm) return;
    setSearchTerm(term);
    setCurrentPage(1);
  }, [searchTerm]);

  const updateActiveTab = useCallback((tab: typeof activeTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  const getQueryParams = useCallback((): JobQueryParams => {
    const statusMap: Record<typeof activeTab, string> = {
      open: "Open",
      "on-hold": "On-Hold",
      "closed-won": "Closed Won",
      "closed-lost": "Closed Lost",
    };

    const sortFieldMap: Partial<Record<SortField, string>> = {
      jobTitle: "title",
    };

    return {
      page: currentPage,
      limit: itemsPerPage,
      sort: sortFieldMap[tableSort.field] || tableSort.field,
      order: tableSort.direction,
      status: statusMap[activeTab],
      search: searchTerm.trim() || undefined,
    };
  }, [currentPage, itemsPerPage, tableSort, activeTab, searchTerm]);

  return {
    searchTerm,
    activeTab,
    view,
    tableSort,
    currentPage,
    itemsPerPage,
    getQueryParams,
    setSearchTerm: updateSearchTerm,
    setActiveTab: updateActiveTab,
    setView,
    setTableSort: handleTableSort,
    setCurrentPage,
  };
};