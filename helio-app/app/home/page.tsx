import Sidebar from "../Components/Sidebar";
import AuthCheck from "../Components/authCheck";

export default function Home() {
  return (
    <AuthCheck>
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        
      </main>
    </div>
    </AuthCheck>
  );
}
