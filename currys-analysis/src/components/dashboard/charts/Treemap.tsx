import React from 'react';
import ReactECharts from 'echarts-for-react';

type Props = {
  option: any;
  className?: string;
  style?: React.CSSProperties;
};

const Treemap: React.FC<Props> = React.memo(({ option, className, style }) => {
  return (
    <ReactECharts
      option={option}
      notMerge
      className={className}
      style={{ width: '100%', height: '100%', ...(style || {}) }}
    />
  );
});

export default Treemap;
