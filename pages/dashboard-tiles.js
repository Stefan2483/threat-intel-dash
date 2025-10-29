import dynamic from 'next/dynamic';
import Head from 'next/head';

const OblivionDashboardTiles = dynamic(
  () => import('@/components/OblivionDashboardTiles'),
  { ssr: false }
);

export default function DashboardTiles() {
  return (
    <>
      <Head>
        <title>Oblivion Threat Intel - Tiles Version</title>
        <meta name="description" content="Threat Intelligence Dashboard with Tiles and Map" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <OblivionDashboardTiles />
    </>
  );
}
