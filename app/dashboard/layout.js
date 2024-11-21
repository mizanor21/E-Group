import Menubar from "../ui/Shared/Menubar/Menubar";
import Nav from "../ui/Shared/Nav/Nav";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Menubar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-[#f2f7ff] text-black">
        <div className="shadow-sm">
          <Nav />
        </div>

        <div className="flex-1 overflow-y-auto  ">
          <div className="p-6 min-h-screen">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
