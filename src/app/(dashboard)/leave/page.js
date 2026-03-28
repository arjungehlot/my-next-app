import LeaveActions from '@/components/LeaveActions';
import { getLeaveHistory } from '@/app/actions';

export default async function LeavePage() {
  const leaveHistory = await getLeaveHistory();
  return <LeaveActions leaveHistory={leaveHistory} />;
}
