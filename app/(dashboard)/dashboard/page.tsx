import { createClient } from '@/utils/supabase/server';
import {
  getUser,
  getUserDetails
} from '@/utils/supabase/queries';
import RobotDashboard from '@/components/robot/RobotDashboard';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
  ]);

 // ✅ BYPASS TEMPORAL PARA LA DEMO
  // if (!user) {
  //   redirect('/signin');
  // }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 gap-4">
      <RobotDashboard />
    </div>
  );
}