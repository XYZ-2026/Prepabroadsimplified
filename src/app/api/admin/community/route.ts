import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import {
  getCommunitySettings,
  updateCommunityWhatsAppUrl,
  getCommunityLeads,
  validateWhatsAppUrl,
  deleteCommunityLead,
  purgeTestLeads,
} from '@/lib/community-service';

export async function GET(req: NextRequest) {
  try {
    const claims = await requireAdmin();
    const settings = await getCommunitySettings();
    const leads = await getCommunityLeads();

    return NextResponse.json({
      success: true,
      settings,
      leads,
      count: leads.length,
      user: {
        email: claims.email,
        role: claims.role || 'admin',
      },
    });
  } catch (error: any) {
    console.error('[Admin Community GET] Error:', error);
    if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch community settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const claims = await requireAdmin();
    const body = await req.json();
    const { activeWhatsAppUrl, note } = body;

    const validation = validateWhatsAppUrl(activeWhatsAppUrl);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error || 'Invalid WhatsApp URL' },
        { status: 400 }
      );
    }

    const updatedSettings = await updateCommunityWhatsAppUrl(
      activeWhatsAppUrl,
      claims.email || 'Administrator',
      note
    );

    return NextResponse.json({
      success: true,
      message: 'Active WhatsApp community URL successfully updated.',
      settings: updatedSettings,
    });
  } catch (error: any) {
    console.error('[Admin Community POST] Error:', error);
    if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update community settings' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const claims = await requireAdmin();
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get('id');
    const purge = searchParams.get('purgeTest');

    if (purge === 'true') {
      const purgedCount = await purgeTestLeads();
      const updatedLeads = await getCommunityLeads();
      return NextResponse.json({
        success: true,
        message: `Successfully purged ${purgedCount} test lead(s).`,
        count: updatedLeads.length,
        leads: updatedLeads,
      });
    }

    if (!leadId) {
      return NextResponse.json({ success: false, error: 'Lead ID is required for deletion.' }, { status: 400 });
    }

    await deleteCommunityLead(leadId);
    const updatedLeads = await getCommunityLeads();

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully.',
      count: updatedLeads.length,
      leads: updatedLeads,
    });
  } catch (error: any) {
    console.error('[Admin Community DELETE] Error:', error);
    if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 403 });
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete lead' },
      { status: 500 }
    );
  }
}


