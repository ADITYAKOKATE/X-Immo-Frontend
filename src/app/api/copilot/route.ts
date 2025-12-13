
import { NextResponse } from 'next/server';
import {
    getPortfolioSummary,
    getPropertyDetails,
    getTenantStatus,
    updateProperty,
    updateTenant,
    getPendingTickets
} from '@/lib/copilotService';
import { findKnowledge } from '@/lib/knowledgeBase';

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
        }

        const lowerPrompt = prompt.toLowerCase();

        // ============================================
        // 0. GREETINGS & SMALL TALK
        // ============================================
        if (['hi', 'hello', 'hey', 'greetings', 'yo'].some(w => lowerPrompt.includes(w))) {
            return NextResponse.json({ success: true, message: "Hello! 👋 I'm your X'Immo Assistant. How can I help you manage your portfolio today?" });
        }

        // ============================================
        // 1. ACTION ENGINE (INTENTS WITH SIDE EFFECTS)
        // ============================================

        // Update Property
        const updatePropertyRegex = /(?:update|change|set) property (.+) (?:rent|price|status|address|title) to (.+)/i;
        const propertyMatch = prompt.match(updatePropertyRegex);
        if (propertyMatch) {
            const [, targetName, value] = propertyMatch;
            let field = '';
            if (lowerPrompt.includes('rent') || lowerPrompt.includes('price')) field = 'monthlyRent';
            else if (lowerPrompt.includes('status')) field = 'status';
            else if (lowerPrompt.includes('address')) field = 'address';
            else if (lowerPrompt.includes('title') || lowerPrompt.includes('name')) field = 'title';

            const result = await updateProperty(targetName.trim(), field, value.trim());
            if (result) return NextResponse.json({ success: true, message: `✅ Updated property "${result.name}". Set ${result.field} to ${result.newValue}.` });
            return NextResponse.json({ success: false, message: `Could not find property matching "${targetName}".` });
        }

        // Update Tenant
        const updateTenantRegex = /(?:update|change|set) tenant (.+) (?:income|salary|phone|status) to (.+)/i;
        const tenantMatch = prompt.match(updateTenantRegex);
        if (tenantMatch) {
            const [, targetName, value] = tenantMatch;
            let field = '';
            if (lowerPrompt.includes('income') || lowerPrompt.includes('salary')) field = 'monthlyIncome';
            else if (lowerPrompt.includes('phone') || lowerPrompt.includes('mobile')) field = 'phone';
            else if (lowerPrompt.includes('status')) field = 'status';

            const result = await updateTenant(targetName.trim(), field, value.trim());
            if (result) return NextResponse.json({ success: true, message: `✅ Updated tenant "${result.name}". Set ${result.field} to ${result.newValue}.` });
            return NextResponse.json({ success: false, message: `Could not find tenant matching "${targetName}".` });
        }

        // ============================================
        // 2. DATA QUERY ENGINE (DYNAMIC DATA)
        // ============================================

        if (lowerPrompt.includes('summary') || lowerPrompt.includes('overview') || lowerPrompt.includes('how are we doing')) {
            const data = await getPortfolioSummary();
            return NextResponse.json({
                success: true,
                message: `📊 **Portfolio Summary**\n\nProperties: ${data.totalProperties}\nTenants: ${data.totalTenants}\nOccupancy Rate: ${data.occupancyRate}%\nHealth: ${data.status}`
            });
        }

        if (lowerPrompt.includes('list properties') || lowerPrompt.includes('show properties')) {
            const properties = await getPropertyDetails();
            const list = properties.map((p: any) => `🏠 **${p.title}**\n   Type: ${p.type}\n   Rent: ₹${p.rent}\n   Status: ${p.status}`).join('\n\n');
            return NextResponse.json({ success: true, message: `Here are your properties:\n\n${list}` });
        }

        if (lowerPrompt.includes('lease') || lowerPrompt.includes('expir') || lowerPrompt.includes('tenants')) {
            const tenants = await getTenantStatus();
            const list = tenants.map((t: any) => `👤 **${t.name}**\n   Status: ${t.status}\n   Lease Ends: ${t.leaseEnd}`).join('\n\n');
            return NextResponse.json({ success: true, message: `Tenant Lease Status:\n\n${list}` });
        }

        if (lowerPrompt.includes('ticket') || lowerPrompt.includes('issue') || lowerPrompt.includes('maintenance')) {
            const tickets = await getPendingTickets();
            if (tickets.length === 0) return NextResponse.json({ success: true, message: "✅ Great news! You have no open maintenance tickets." });

            const list = tickets.map((t: any) => `🎫 **${t.title}**\n   Priority: ${t.priority}\n   At: ${t.property}`).join('\n\n');
            return NextResponse.json({ success: true, message: `Here are your open tickets:\n\n${list}` });
        }

        // ============================================
        // 3. KNOWLEDGE BASE (STATIC FAQ)
        // ============================================

        const knowledgeAnswer = findKnowledge(prompt);
        if (knowledgeAnswer) {
            return NextResponse.json({ success: true, message: knowledgeAnswer });
        }

        // ============================================
        // 4. FALLBACK
        // ============================================

        return NextResponse.json({
            success: false,
            message: "I'm not sure about that. I can help you with:\n\n• Portfolio Summaries\n• Updating Property/Tenant details\n• Listing active Maintenance Tickets\n• General questions about the X'Immo platform"
        });

    } catch (error: any) {
        console.error('Copilot Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
