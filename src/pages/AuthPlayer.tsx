import HeaderAuthPlayer from "../components/AuthPlayer/HeaderAuthPlayer";
import InputName from "../components/AuthPlayer/InputName";

const AuthPlayer = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1016]">
      <div className="w-full max-w-md rounded-lg bg-[#1c1d24] p-6 shadow-lg ring-1 ring-white/10">
        {/* Header */}
        <div className="mb-6 text-center">
          <HeaderAuthPlayer />
        </div>

        {/* Form */}
        <InputName />
      </div>
    </div>
  );
};

export default AuthPlayer;
