import { createFileRoute } from '@tanstack/react-router';
import TripItemPage from '../../../features/tripDetail/pages';

export const Route = createFileRoute('/tripItem/$tripId/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <TripItemPage />;
}
