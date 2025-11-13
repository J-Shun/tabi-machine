import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools
        initialIsOpen={false}
        position='bottom-right'
        toggleButtonProps={{
          className: 'translate-x-[-80px] translate-y-[-10px]',
        }}
      />
    </>
  );
}

export default Route;
