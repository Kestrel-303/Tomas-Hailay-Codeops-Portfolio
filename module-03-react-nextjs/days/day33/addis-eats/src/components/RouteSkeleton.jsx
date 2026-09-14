import PropTypes from 'prop-types';

function RouteSkeleton({ label = 'Loading…' }) {
  return (
    <div className="route-skeleton" role="status" aria-live="polite">
      <div className="skeleton-bar skeleton-bar-wide" />
      <div className="skeleton-bar" />
      <div className="skeleton-bar" />
      <div className="skeleton-bar skeleton-bar-short" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

RouteSkeleton.propTypes = {
  label: PropTypes.string,
};

export default RouteSkeleton;
