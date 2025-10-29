import dynamic from 'next/dynamic';
import Head from 'next/head';

const OblivionThreatIntelMarkup = dynamic(
  () => import('@/components/OblivionThreatIntelMarkup'),
  { ssr: false }
);

export default function DashboardMarkup() {
  return (
    <>
      <Head>
        <title>Threat Intelligence Dashboard</title>
        <meta name="description" content="Real-time cybersecurity threat intelligence from multiple sources" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <OblivionThreatIntelMarkup />
    </>
  );
}
