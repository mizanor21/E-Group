"use client";
const AccountsDashboard = ({}) => {
  return (
    <div>
      <div className="flex justify-between">
        <h2>Accounts Dashboard</h2>
        <div className="">
          {/* Open the modal using document.getElementById('ID').showModal() method */}
          <button
            className="btn"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            open modal
          </button>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Hello!1</h3>
              <p className="py-4">Press ESC key or click outside to close</p>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
          <button
            className="btn"
            onClick={() => document.getElementById("my_modal_2").showModal()}
          >
            open modal 2
          </button>
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Hello!2</h3>
              <p className="py-4">Press ESC key or click outside to close</p>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>

          <button
            className="btn"
            onClick={() => document.getElementById("my_modal_3").showModal()}
          >
            open modal 3
          </button>
          <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Hello! 3</h3>
              <p className="py-4">Press ESC key or click outside to close</p>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default AccountsDashboard;
