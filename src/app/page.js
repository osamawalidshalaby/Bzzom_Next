import HomeClient from "./HomeClient";
import { homeMetadata } from "./metadata";

export const metadata = homeMetadata;

export default function Home() {
  return <HomeClient />;
}
