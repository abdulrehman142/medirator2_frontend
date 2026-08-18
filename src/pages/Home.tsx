import Complaints from "../components/Complaints";
import ScrollAnimation from "../components/ScrollAnimation";

export default function Home() {
  return (
    <div className="bg-black">
      <ScrollAnimation />
      <Complaints />
    </div>
  );
}
