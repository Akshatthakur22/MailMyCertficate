import AboutPage from '@/views/about/AboutPage';
import { AboutStructuredData } from '@/components/seo/AboutStructuredData';

export default function About() {
  return (
    <>
      <AboutStructuredData />
      <AboutPage />
    </>
  );
}
