import * as React from 'react';

export interface IBadgeSampleProps {
  label: string;
  labelColor: string;
  countColor: string;
  badgeStyle: string;
  badgeType: string;
  labelStyle: string;
}

const counts: { [type: string]: string } = {
  total: '1234',
  daily: '56',
  combined: '56 / 1234'
};

// A local approximation of the badge, shown until there is a URL to request the real one for
export const BadgeSample: React.FunctionComponent<IBadgeSampleProps> = ({ label, labelColor, countColor, badgeStyle, badgeType, labelStyle }: React.PropsWithChildren<IBadgeSampleProps>) => {
  const isDefault = badgeStyle === 'default';
  const radius = badgeStyle === 'flat' ? 3 : badgeStyle === 'plastic' ? 4 : 0;
  const shine = badgeStyle === 'plastic' ? 'linear-gradient(180deg, rgba(255,255,255,.25), rgba(0,0,0,.15))' : undefined;

  let text = label || 'VISITORS';
  if (isDefault || labelStyle === 'upper') {
    text = text.toUpperCase();
  } else if (labelStyle === 'lower') {
    text = text.toLowerCase();
  }

  const cellStyle = `px-3 text-white whitespace-nowrap ${isDefault ? 'py-2 text-sm tracking-widest' : 'py-1 text-xs'}`;

  return (
    <span className="inline-flex max-w-full overflow-hidden" style={{ borderRadius: radius, fontFamily: 'Verdana, sans-serif' }} aria-hidden="true">
      {
        labelStyle !== 'none' && (
          <span className={`${cellStyle} truncate`} style={{ backgroundColor: labelColor, backgroundImage: shine }}>{text}</span>
        )
      }
      <span className={`${cellStyle} font-bold`} style={{ backgroundColor: countColor, backgroundImage: shine }}>{counts[badgeType]}</span>
    </span>
  );
};
