import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackArrow = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-700 hover:text-black">
        <ArrowLeft className="w-6 h-6 mr-2" />
        <span>Back</span>
      </button>
    </div>
  );
}

export default BackArrow;
