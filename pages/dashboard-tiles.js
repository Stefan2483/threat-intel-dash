import Head from 'next/head';
import dynamic from 'next/dynamic';

const OblivionDashboardTiles = dynamic(
  () => import('../components/OblivionDashboardTiles'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        minHeight: '100vh',
        background: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#00d9ff'
      }}>
        <div>Loading Dashboard...</div>
      </div>
    )
  }
);

export default function DashboardTiles() {
  return (
    <>
      <Head>
        <title>Threat Intelligence Dashboard</title>
        <meta name="description" content="Real-time cybersecurity threat intelligence from multiple sources" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <OblivionDashboardTiles />
    </>
  );
}
