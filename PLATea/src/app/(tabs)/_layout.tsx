import AppTabs from '../../components/app-tabs';
import { BloomingFilterProvider } from '../../hooks/useBloomingFilter';

export default function TabLayout() {
  return (
    <BloomingFilterProvider>
      <AppTabs />
    </BloomingFilterProvider>
  );
}

