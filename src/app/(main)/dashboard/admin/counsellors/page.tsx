import { redirect } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import { getUserRole } from '@/lib/auth';
import AdminCounsellorsClient, { CounsellorData, AllottedStudentData } from '@/components/Admin/AdminCounsellorsClient';
import styles from '@/styles/admin-users.module.css';

export default async function AdminCounsellorsPage() {
  const role = await getUserRole();
  if (role !== 'admin') {
    redirect('/auth');
  }

  let counsellors: CounsellorData[] = [];

  try {
    // 1. Fetch all users with role 'counsellor'
    const counsellorsSnap = await adminDb
      .collection('users')
      .where('role', '==', 'counsellor')
      .get();

    // 2. Fetch all users with assignedCounsellor field set
    const studentsSnap = await adminDb
      .collection('users')
      .where('assignedCounsellor', '!=', null)
      .get();

    const studentsByCounsellor: Record<string, AllottedStudentData[]> = {};

    studentsSnap.docs.forEach(doc => {
      const data = doc.data();
      const counsellorId = data.assignedCounsellor;
      if (!counsellorId) return;

      let createdAtStr = 'Unknown';
      if (data.createdAt) {
        const date = data.createdAt.toDate();
        createdAtStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      }

      const studentItem: AllottedStudentData = {
        id: doc.id,
        name: data.name || 'Unknown',
        email: data.email || '',
        mobile: data.mobile || '',
        studentType: data.studentType || '',
        state: data.state || '',
        city: data.city || '',
        createdAtStr,
      };

      if (!studentsByCounsellor[counsellorId]) {
        studentsByCounsellor[counsellorId] = [];
      }
      studentsByCounsellor[counsellorId].push(studentItem);
    });

    counsellors = counsellorsSnap.docs.map(doc => {
      const data = doc.data();
      let createdAtStr = 'Unknown';
      if (data.createdAt) {
        const date = data.createdAt.toDate();
        createdAtStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      }

      return {
        id: doc.id,
        name: data.name || 'Unknown',
        email: data.email || '',
        mobile: data.mobile || '',
        state: data.state || '',
        city: data.city || '',
        createdAtStr,
        designation: data.designation || '',
        specialization: data.specialization || '',
        experienceYears: data.experienceYears || '',
        bio: data.bio || '',
        allottedStudents: studentsByCounsellor[doc.id] || [],
      };
    });

  } catch (error) {
    console.error('Error fetching counsellors for admin:', error);
  }

  return (
    <div className={styles.adminContent}>
      <AdminCounsellorsClient counsellors={counsellors} />
    </div>
  );
}
