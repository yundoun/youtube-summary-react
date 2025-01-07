import { FileText, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export const PROGRESS_STEPS = [
  {
    icon: FileText,
    label: '스크립트 추출 중...'
  },
  {
    icon: Sparkles,
    label: 'AI 분석 중...'
  },
  {
    icon: Clock,
    label: '요약문 생성 중...'
  },
  {
    icon: CheckCircle2,
    label: '요약 완료!'
  }
];