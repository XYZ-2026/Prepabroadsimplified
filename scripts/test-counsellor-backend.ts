import { 
  getCommunitySettings, 
  updateCommunityWhatsAppUrl, 
  saveCommunityLead, 
  getCommunityLeads, 
  deleteCommunityLead
} from '../src/lib/community-service';

async function runAudit() {
  console.log('--- STARTING BACKEND SERVICE AUDIT ---');

  // 1. Verify separate settings retrieval
  const studentSettings = await getCommunitySettings('student_parent');
  console.log('[Check 1] Student Settings WhatsApp URL:', studentSettings.activeWhatsAppUrl);
  console.log('[Check 1] Student Settings QR URL:', studentSettings.qrLandingPageUrl);

  const counsellorSettings = await getCommunitySettings('counsellor_mentor');
  console.log('[Check 2] Counsellor Settings WhatsApp URL:', counsellorSettings.activeWhatsAppUrl);
  console.log('[Check 2] Counsellor Settings QR URL:', counsellorSettings.qrLandingPageUrl);

  if (studentSettings.activeWhatsAppUrl === counsellorSettings.activeWhatsAppUrl) {
    throw new Error('FAIL: Both communities share the same WhatsApp URL!');
  }
  if (counsellorSettings.activeWhatsAppUrl !== 'https://chat.whatsapp.com/C6UVHin2Qkv9rhBqON8BHQ') {
    throw new Error('FAIL: Counsellor WhatsApp URL does not match requested destination!');
  }
  console.log('✅ Independent WhatsApp settings confirmed!');

  // 2. Test saving a Counsellor Community lead
  const testCounsellorLead = await saveCommunityLead({
    name: 'Dr. Anita Roy',
    phone: '+91 98111 22334',
    email: 'anita.roy.test@example.com',
    linkedInUrl: 'https://www.linkedin.com/in/anita-roy-counsellor',
    campaign: 'mentor_counsellor_community',
  });

  console.log('[Check 3] Saved Counsellor Lead:', {
    id: testCounsellorLead.id,
    name: testCounsellorLead.name,
    source: testCounsellorLead.source,
    linkedInUrl: testCounsellorLead.linkedInUrl,
  });

  if (testCounsellorLead.source !== 'mentor_counsellor_community') {
    throw new Error('FAIL: Lead source is not mentor_counsellor_community!');
  }
  if (testCounsellorLead.linkedInUrl !== 'https://www.linkedin.com/in/anita-roy-counsellor') {
    throw new Error('FAIL: LinkedIn URL was not saved correctly!');
  }
  console.log('✅ Counsellor lead persistence confirmed!');

  // 3. Test filtering leads by campaign
  const counsellorLeads = await getCommunityLeads('mentor_counsellor_community');
  const studentLeads = await getCommunityLeads('clarvo_student_parent_community');
  console.log('[Check 4] Filtered Leads Count -> Counsellors:', counsellorLeads.length, 'Students:', studentLeads.length);

  // 4. Test updating Counsellor WhatsApp URL without touching Student URL
  const testNewCounsellorUrl = 'https://chat.whatsapp.com/C6UVHin2Qkv9rhBqON8BHQ';
  await updateCommunityWhatsAppUrl(testNewCounsellorUrl, 'Admin Test', 'Verification check', 'counsellor_mentor');

  const reloadedStudent = await getCommunitySettings('student_parent');
  const reloadedCounsellor = await getCommunitySettings('counsellor_mentor');

  if (reloadedStudent.activeWhatsAppUrl === testNewCounsellorUrl) {
    throw new Error('FAIL: Student URL was unexpectedly changed by counsellor update!');
  }
  console.log('✅ Strict separation confirmed: Student link untouched when Counsellor link is updated!');

  // Clean up test lead
  await deleteCommunityLead(testCounsellorLead.id);
  console.log('✅ Cleaned up test lead:', testCounsellorLead.id);

  console.log('--- ALL BACKEND CHECKS PASSED SUCCESSFULLY ---');
}

runAudit().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});

