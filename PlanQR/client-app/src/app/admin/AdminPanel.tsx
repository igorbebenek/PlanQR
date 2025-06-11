import DeviceForm from "./DeviceForm";
import DeviceList from "./DeviceList";

const AdminPanel = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Panel zarządzania urządzeniami</h1>
      <DeviceForm />
      <hr />
      <DeviceList />
    </div>
  );
};

export default AdminPanel;