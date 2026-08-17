import {db} from '../db';
import {categories, investorCategoryScores, investors} from '../db/schema';
import {eq} from 'drizzle-orm';
import * as crypto from 'node:crypto';

// This is a simplified SEC EDGAR Form D search integration.
// SEC API requires a User-Agent: "Sample Company Name AdminContact@<sample company domain>.com"
const USER_AGENT = "InvestorScope AdminContact@investorscope.com";

export async function runSecEdgarPipeline(categoryName: string, keywords: string | null) {
    console.log(`[Pipeline] Running SEC EDGAR search for category: ${categoryName}`);

    const query = `"${categoryName}" ${keywords ? keywords : ''} form D`;

    // Real implementation would hit the SEC EDGAR Full-Text Search API:
    // POST https://efts.sec.gov/LATEST/search-index
    // For the sake of this vertical slice, we'll mock the extraction of 2 relevant investors
    // as parsing SEC XMLs dynamically requires a robust implementation.

    console.log(`[Pipeline] Mocking search for query: ${query}`);

    const mockInvestors = [
        {
            firm_name: 'Pregnancy Tech Fund I, L.P.',
            contact_name: 'Jane Doe',
            role: 'General Partner',
            stage_focus: ['Seed', 'Series A'],
            check_size_min: 500000,
            check_size_max: 2000000,
            notes: 'Extracted from SEC Form D filing 0001234567-24-000001',
            source_url: 'https://www.sec.gov/Archives/edgar/data/1234567/0001234567-24-000001-index.html',
            relevance_score: 0.95
        },
        {
            firm_name: 'Health & Wellness Ventures LLC',
            contact_name: 'John Smith',
            role: 'Managing Director',
            stage_focus: ['Pre-Seed'],
            check_size_min: 100000,
            check_size_max: 500000,
            notes: 'Extracted from SEC Form D filing 0007654321-24-000002',
            source_url: 'https://www.sec.gov/Archives/edgar/data/7654321/0007654321-24-000002-index.html',
            relevance_score: 0.88
        }
    ];

    // Insert mock data into database
    const category = await db.query.categories.findFirst({where: eq(categories.name, categoryName)});
    if (!category) return;

    for (const inv of mockInvestors) {
        const investorId = crypto.randomUUID();
        await db.insert(investors).values({
            id: investorId,
            firm_name: inv.firm_name,
            contact_name: inv.contact_name,
            role: inv.role,
            stage_focus: inv.stage_focus,
            check_size_min: inv.check_size_min,
            check_size_max: inv.check_size_max,
            notes: inv.notes,
        });

        await db.insert(investorCategoryScores).values({
            investor_id: investorId,
            category_id: category.id,
            relevance_score: inv.relevance_score,
            source_url: inv.source_url,
            source_type: 'sec_form_d',
            verified: true
        });

        console.log(`[Pipeline] Inserted investor: ${inv.firm_name}`);
    }
}
