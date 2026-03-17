import { Panel } from '@/components/shared/Panel';

interface ExplanationPanelProps {
  title: string;
  description: string;
  explanation: string;
}

export const ExplanationPanel = ({
  title,
  description,
  explanation,
}: ExplanationPanelProps) => (
  <Panel title={title} subtitle={description}>
    <p className="text-sm leading-7 text-ink">{explanation}</p>
  </Panel>
);
