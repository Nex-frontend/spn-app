import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello <span className="font-bold">Hoisliwis</span>
    </div>
  );
}
