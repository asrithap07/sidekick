export interface DailyState {
  id: string;
  state_date: string;
  streak: number;
  completion_rate: number;
  overdue_count: number;
  momentum_delta: number;
  brief_focus: string | null;
  brief_risk: string | null;
  brief_do_first: string | null;
  brief_avoid: string | null;
  generated_at: string;
}