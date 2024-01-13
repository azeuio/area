import React from 'react';

function Spinner() {
  return (
    <div className="scale-150">
      <span className="material-symbols-outlined animate-spin" role="img">
        progress_activity
      </span>
    </div>
  );
}

export default Spinner;
