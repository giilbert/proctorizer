import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

export const Route = createRootRouteWithContext()({
  component: () => (
    <div className="m-4">
      <Outlet />
    </div>
  ),
});
