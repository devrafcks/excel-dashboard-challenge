import { type FC } from 'react';
import '../styles/SimpleCard.css';

type SimpleCardProps = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

export const SimpleCard: FC<SimpleCardProps> = ({ label, value, icon }) => (
  <div className="simple-card">
    <div className="simple-card-header">
      <span className="simple-card-label">{label}</span>
      {icon && <span>{icon}</span>}
    </div>
    <div className="simple-card-value">{value}</div>
  </div>
);
