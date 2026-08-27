import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifySessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { student, scores, narrative, assessmentType, questions, answers } = data;

    // Check if the user is logged in
    const claims = await verifySessionCookie();
    
    let userName = student?.name || 'Candidate';
    if (claims && (!student?.name || student.name === 'Candidate' || student.name === 'Guest Student')) {
      try {
        const userDoc = await adminDb.collection('users').doc(claims.uid).get();
        if (userDoc.exists) {
          userName = userDoc.data()?.name || claims.name || 'Candidate';
        } else {
          userName = claims.name || 'Candidate';
        }
        userName = userName.split(' ')[0];
      } catch (error) {
        console.warn('Error fetching user name for psychometric test:', error);
      }
    }

    let testName = 'Psychometric Assessment';
    if (assessmentType === 'junior') testName = 'Junior Psychometric Test';
    else if (assessmentType === 'grade10') testName = 'Grade 10 Psychometric Test';
    else if (assessmentType === 'highschool') testName = 'Grade 11/12 Psychometric Test';

    // Prepare full document
    const finalDocument = {
      testName,
      type: 'psychometric',
      assessmentType,
      student: { ...student, name: userName },
      scores,
      narrative,
      questions: questions || null,
      answers: answers || null,
      userId: claims ? claims.uid : null, // Attach userId if available
      createdAt: new Date().toISOString(),
    };

    // Save to Firebase Firestore
    const docRef = await adminDb.collection('psychometric_results').add(finalDocument);

    // Create the workflow document for this assessment
    await adminDb.collection('assessment_workflow').doc(docRef.id).set({
      resultId: docRef.id,
      studentId: claims ? claims.uid : null,
      state: 'parent_pending',
      updatedAt: new Date().toISOString()
    });

    // Pre-generate reportSnapshot ONCE on submit (0 Groq calls on subsequent views/downloads)
    try {
      const { getOrGenerateReportSnapshot } = await import('@/lib/report-snapshot-service');
      const overallApt = Math.round(
        ((scores?.aptitude?.numerical || 75) +
         (scores?.aptitude?.reasoning || 80) +
         (scores?.aptitude?.verbal || 75) +
         (scores?.aptitude?.spatial || 74)) / 4
      );
      await getOrGenerateReportSnapshot({
        resultId: docRef.id,
        student: {
          name: userName,
          grade: student?.grade || 'Class 10',
          age: student?.age || '15',
          school: student?.school || '',
          city: student?.city || 'India',
          stream: student?.stream || '',
          email: student?.email || '',
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          reportId: `AS-10-${docRef.id.substring(0, 6).toUpperCase()}`,
        },
        scores: {
          aptitude: {
            verbal: scores?.aptitude?.verbal || 75,
            numerical: scores?.aptitude?.numerical || 78,
            reasoning: scores?.aptitude?.reasoning || 80,
            spatial: scores?.aptitude?.spatial || 74,
            overall: scores?.aptitude?.overall || overallApt,
          },
          personality: {
            openness: scores?.personality?.openness || 75,
            conscientiousness: scores?.personality?.conscientiousness || 76,
            extraversion: scores?.personality?.extraversion || 68,
            agreeableness: scores?.personality?.agreeableness || 74,
            emotionalStability: scores?.personality?.emotionalStability || 70,
          },
          topRiasec: scores?.topRiasec || ['Investigative', 'Realistic', 'Artistic'],
          riasec: scores?.riasec || {},
          topVark: scores?.topVark || 'V',
          vark: scores?.vark || {},
          topValues: scores?.topValues || ['Autonomy', 'Mastery', 'Purpose'],
          careerFitment: scores?.careerFitment || [
            { name: 'STEM & Engineering Pathway', score: 95 },
            { name: 'Data Science & Analytical Computing', score: 92 },
            { name: 'Architecture & Design Systems', score: 88 },
            { name: 'Business Analytics & Commerce', score: 84 },
          ],
        },
      });
    } catch (rsErr) {
      console.warn('[Submit Route] Initial reportSnapshot generation warning:', rsErr);
    }

    return NextResponse.json({ 
      success: true, 
      resultId: docRef.id
    });
  } catch (error) {
    console.error('Error submitting psychometric test:', error);
    return NextResponse.json({ success: false, message: 'Failed to submit test' }, { status: 500 });
  }
}
