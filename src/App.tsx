import ControlledForm from './components/ControlledForm';
import Modal from './shared/Modal';
import UncontrolledForm from './components/UncontrolledForm';
import useStoreForms from './store/ModalStore';
import Button from './shared/Button';

function App() {
  let { openModal, modalKind } = useStoreForms((state) => state);
  const currentForm =
    modalKind === 'controlled' ? <ControlledForm /> : modalKind === 'uncontrolled' ? <UncontrolledForm /> : null;

  return (
    <>
      <div className="h-screen flex justify-center items-center bg-[#e8f4fa]">
        <div className="shadow-xl/30 shadow-blue-700/50 p-4  text-center w-fit">
          <h1 className="mb-5 text-2xl font-bold">Forms</h1>
          <div className=" flex mx-auto items-center  inset-0 gap-2">
            <Button onClick={() => openModal('uncontrolled')}>Uncontrolled Form</Button>
            <Button onClick={() => openModal('controlled')}>Controlled Form</Button>
            {currentForm && <Modal>{currentForm}</Modal>}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
