import Head from 'next/head';
import OblivionDashboardTiles from '../components/OblivionDashboardTiles';

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
