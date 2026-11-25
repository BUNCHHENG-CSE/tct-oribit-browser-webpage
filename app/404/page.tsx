import NotFound from "../not-found";

export const metadata = {
  title: "404 Not Found — Lost in Orbit",
  description: "The requested coordinate does not exist in this sector.",
};

export default function Custom404Page() {
  return <NotFound />;
}
