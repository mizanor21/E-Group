import { Toaster } from "@/components/ui/toaster";
import Nav from "../ui/Shared/Nav/Nav";
import Sidebar from "../ui/Shared/Sidebar/Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen ">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-[#f2f7ff] text-black">
        <div className="px-5 pt-5">

        <Nav />
        </div>
        <div className="flex-1 overflow-y-auto  ">
          <div className="p-5 min-h-screen">{children}
          <Toaster />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
