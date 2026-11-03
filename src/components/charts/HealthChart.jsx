import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
ChartJS.register(ArcElement, Tooltip);
export function getHealthDistribution(dependencies) {
  const vulnerable = dependencies.filter((d) => d.vulnerability.count > 0).length;
  const outdated = dependencies.filter(
    (d) => d.vulnerability.count === 0 && d.updateStatus === 'outdated',
  ).length;
  const current = dependencies.filter(
    (d) => d.vulnerability.count === 0 && d.updateStatus === 'current',
  ).length;
  const unknown = Math.max(0, dependencies.length - vulnerable - outdated - current);
  return { vulnerable, outdated, current, unknown };
}
export default function HealthChart({ dependencies }) {
  const distribution = getHealthDistribution(dependencies);
  const data = {
    labels: ['Current', 'Outdated', 'Vulnerable', 'Unknown'],
    datasets: [
      {
        data: [
          distribution.current,
          distribution.outdated,
          distribution.vulnerable,
          distribution.unknown,
        ],
        backgroundColor: ['#57e3b0', '#f3b85b', '#f27676', '#455166'],
        borderWidth: 0,
        hoverOffset: 5,
      },
    ],
  };
  return (
    <div className="chart-wrap">
      <Doughnut
        data={data}
        options={{
          cutout: '76%',
          plugins: { legend: { display: false }, tooltip: { enabled: true } },
          maintainAspectRatio: false,
        }}
      />
      <div className="chart-center">
        <b>{dependencies.length}</b>
        <span>PACKAGES</span>
      </div>
    </div>
  );
}
