export const getStatusColors = (status: string) => {
    switch (status) {
        case 'To Be Scheduled':
            return { backgroundColor: '#FFFBEB', color: '#B45309' };
        case 'Scheduled':
            return { backgroundColor: '#F5F3FF', color: '#7C3AED' };
        case 'Awaiting Feedback':
            return { backgroundColor: '#F1F5F9', color: '#475569' };
        case 'Others':
            return { backgroundColor: '#E0F2FE', color: '#075985' };
        case 'Selected':
            return { backgroundColor: '#D1FAE5', color: '#065F46' };
        case 'Rejected':
            return { backgroundColor: '#FFF1F2', color: '#E11D48' };
        case 'Active':
            return { backgroundColor: '#FFFBEB', color: '#B45309' };
        default:
            return { backgroundColor: '#FFFBEB', color: '#B45309' };
    }
};
