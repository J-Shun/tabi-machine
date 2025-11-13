import { createFileRoute } from '@tanstack/react-router';
import TripDetailPage from '../../../features/tripDetail/pages';

export const Route = createFileRoute('/tripDetail/$tripId/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <TripDetailPage />;
}
