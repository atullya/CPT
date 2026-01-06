export const formatFieldLabel = (field: string): string => {
    switch (field) {
        case "title":
            return "Title";
        case "status":
            return "Status";
        case "clientName":
            return "Client Name";
        case "minimumExperience":
            return "Min Exp";
        case "region":
            return "Region";
        case "clientLogo":
            return "Client Logo";
        default:
            return field;
    }
};

export const formatHistoryValue = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
};

export const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

export const getDaysSince = (dateString?: string) => {
    if (!dateString) return "0 Days";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} Day${diffDays !== 1 ? "s" : ""}`;
};
