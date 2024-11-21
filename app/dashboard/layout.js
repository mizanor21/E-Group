import Menubar from "../ui/Shared/Menubar/Menubar";
import Nav from "../ui/Shared/Nav/Nav";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Menubar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-5 p-5">
        <Nav />

        <div className="flex-1 overflow-y-auto bg-gray-100">
          <div className="bg-white shadow rounded-lg p-6 min-h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
