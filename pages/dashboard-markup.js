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
        <title>Oblivion Threat Intel - Markup Version</title>
        <meta name="description" content="Threat Intelligence Dashboard with Markup Style" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <OblivionThreatIntelMarkup />
    </>
  );
}
