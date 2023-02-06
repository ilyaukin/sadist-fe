import React from "react";

interface LoaderProps {
  loading: boolean;
}

const Loader = (props: LoaderProps) => {
  return props.loading ? <wired-spinner spinning id="loader"/> : null;
}

export default Loader;
