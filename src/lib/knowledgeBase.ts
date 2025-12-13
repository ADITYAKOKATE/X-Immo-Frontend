
export const KNOWLEDGE_BASE = [
    {
        keywords: ['what is', 'about', 'ximmo', 'platform'],
        answer: "X'Immo is a comprehensive property management solution designed for modern landlords. It helps you manage properties, tenants, rent payments, and maintenance tickets in one unified dashboard."
    },
    {
        keywords: ['reset', 'password', 'forgot'],
        answer: "To reset your password, contact your administrator or use the 'Forgot Password' link on the login page (feature coming soon). For now, please ensure you keep your credentials safe."
    },
    {
        keywords: ['add property', 'new property', 'create property'],
        answer: "To add a property, navigate to the 'Properties' tab in the sidebar and click the '+ Add Property' button. You'll need to provide details like title, address, rent amount, and type."
    },
    {
        keywords: ['add tenant', 'new tenant', 'onboard'],
        answer: "To onboard a tenant, go to the 'Tenants' section and click '+ Add Tenant'. You can link them to an existing property, set their lease terms, and upload their documents."
    },
    {
        keywords: ['rent', 'payment', 'record'],
        answer: "Rent payments can be tracked in the 'Rent' section. You can view payment history, distinct statuses (paid/overdue), and generate reports."
    },
    {
        keywords: ['ticket', 'issue', 'maintenance', 'report'],
        answer: "Maintenance requests are handled in the 'Tickets' section. You can create tickets, assign priorities (Low/Medium/High), and track their resolution status."
    },
    {
        keywords: ['contact', 'support', 'help'],
        answer: "If you need technical support, you can reach out via the 'Contact' page on our public site or email support@ximmo.com."
    },
    {
        keywords: ['money', 'revenue', 'income'],
        answer: "Check the 'Dashboard' for a real-time overview of your financial performance, including 'Rent Due This Month' and occupancy rates."
    }
];

export function findKnowledge(query: string): string | null {
    const lowerQuery = query.toLowerCase();

    // Find best match based on keyword overlap
    const match = KNOWLEDGE_BASE.find(item =>
        item.keywords.some(k => lowerQuery.includes(k))
    );

    return match ? match.answer : null;
}
