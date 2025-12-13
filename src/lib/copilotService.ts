import Property from '@/models/Property';
import Tenant from '@/models/Tenant';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

// Helper to get a quick summary of the portfolio
export async function getPortfolioSummary() {
    await connectDB();
    const totalProperties = await Property.countDocuments({});
    const totalTenants = await Tenant.countDocuments({});

    // Simple occupancy calculation
    const occupancyRate = totalProperties > 0
        ? Math.round((totalTenants / totalProperties) * 100)
        : 0;

    return {
        totalProperties,
        totalTenants,
        occupancyRate,
        status: 'Healthy' // Placeholder logic
    };
}

// Helper to find specific details about properties
export async function getPropertyDetails() {
    await connectDB();
    const properties = await Property.find({}).select('title address monthlyRent type status').limit(10);
    return properties.map(p => ({
        title: p.title,
        address: p.address,
        rent: p.monthlyRent,
        type: p.type,
        status: p.status
    }));
}

// Helper to find tenant status (e.g. lease end dates)
export async function getTenantStatus() {
    await connectDB();
    const tenants = await Tenant.find({}).select('name leaseEnd property status monthlyIncome');
    return tenants.map(t => ({
        name: t.name,
        leaseEnd: t.leaseEnd ? new Date(t.leaseEnd).toLocaleDateString() : 'N/A',
        status: t.status,
        income: t.monthlyIncome
    }));
}

// Helper: Get Pending Tickets
import Ticket from '@/models/Ticket';
export async function getPendingTickets() {
    await connectDB();
    const tickets = await Ticket.find({ status: { $in: ['open', 'in_progress'] } })
        .populate('property', 'title')
        .limit(5);

    return tickets.map(t => ({
        title: t.title,
        priority: t.priority,
        property: (t.property as any)?.title || 'Unassigned',
        status: t.status
    }));
}

// ACTION ENGINE: Generic Property Update
export async function updateProperty(targetName: string, field: string, value: string) {
    await connectDB();

    // 1. Fuzzy Search for Property
    // specific regex to match simplified name
    const property = await Property.findOne({
        title: { $regex: new RegExp(targetName, 'i') }
    });

    if (!property) return null;

    // 2. Map Natural Language Field to DB Field
    let dbField = '';
    let parsedValue: any = value;

    switch (field.toLowerCase()) {
        case 'rent':
        case 'price':
        case 'monthly rent':
            dbField = 'monthlyRent';
            parsedValue = Number(value.replace(/[^0-9.]/g, '')); // Remove currency symbols
            break;
        case 'status':
            dbField = 'status';
            // Simple normalization for status
            if (value.toLowerCase().includes('avail')) parsedValue = 'Available';
            else if (value.toLowerCase().includes('rent')) parsedValue = 'Rented';
            else if (value.toLowerCase().includes('maint')) parsedValue = 'Maintenance';
            break;
        case 'address':
            dbField = 'address';
            break;
        case 'title':
        case 'name':
            dbField = 'title';
            break;
        default:
            throw new Error(`Field '${field}' is not supported for updates.`);
    }

    // 3. Perform Update
    if (dbField) {
        property[dbField] = parsedValue;
        await property.save();
    }

    return {
        name: property.title,
        field: dbField,
        newValue: parsedValue
    };
}

// ACTION ENGINE: Generic Tenant Update
export async function updateTenant(targetName: string, field: string, value: string) {
    await connectDB();

    const tenant = await Tenant.findOne({
        name: { $regex: new RegExp(targetName, 'i') }
    });

    if (!tenant) return null;

    let dbField = '';
    let parsedValue: any = value;

    switch (field.toLowerCase()) {
        case 'income':
        case 'monthly income':
        case 'salary':
            dbField = 'monthlyIncome';
            parsedValue = Number(value.replace(/[^0-9.]/g, ''));
            break;
        case 'phone':
        case 'mobile':
            dbField = 'phone';
            break;
        case 'status':
            dbField = 'status';
            if (value.toLowerCase().includes('active')) parsedValue = 'active';
            else if (value.toLowerCase().includes('vacant')) parsedValue = 'vacant';
            else if (value.toLowerCase().includes('notice')) parsedValue = 'notice';
            else if (value.toLowerCase().includes('evict')) parsedValue = 'evicted';
            break;
        case 'name':
            dbField = 'name';
            break;
        default:
            throw new Error(`Field '${field}' is not supported for updates.`);
    }

    if (dbField) {
        tenant[dbField] = parsedValue;
        await tenant.save();
    }

    return {
        name: tenant.name,
        field: dbField,
        newValue: parsedValue
    };
}
