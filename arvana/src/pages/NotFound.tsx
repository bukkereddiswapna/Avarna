import { LinkButton } from "../components/common/Button";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-5">
      <div className="text-center">
        <p className="font-display text-7xl text-beige-dark">404</p>
        <h1 className="mt-4 font-display text-2xl md:text-3xl text-charcoal">Page Not Found</h1>
        <p className="mt-3 text-sm text-charcoal-light max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <LinkButton to="/">Back to Home</LinkButton>
        </div>
      </div>
    </div>
  );
}
